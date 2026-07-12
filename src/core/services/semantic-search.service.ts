import { ProjectFile } from '../ports/file-system.port.js';

export interface SearchMatch {
  relativePath: string;
  startLine: number;
  endLine: number;
  snippet: string;
  score: number;
  artifactType: 'code' | 'config' | 'infra' | 'docs' | 'test' | 'other';
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
  'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
  'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
  'we', 'wed', 'well', 'were', 'werent', 'weve', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
  'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
  'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

interface Chunk {
  relativePath: string;
  startLine: number;
  endLine: number;
  content: string;
  tokens: string[];
  tf: Record<string, number>;
}

export interface SearchBackend {
  search(files: ProjectFile[], query: string, topK: number): SearchMatch[];
}

export class TFIDFBackend implements SearchBackend {
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-zA-Z0-9_\-$]/)
      .map(token => token.trim())
      .filter(token => token.length > 1 && !STOP_WORDS.has(token));
  }

  private classifyArtifact(relativePath: string): SearchMatch['artifactType'] {
    const ext = relativePath.split('.').pop()?.toLowerCase();
    const name = relativePath.split('/').pop()?.toLowerCase();

    if (relativePath.includes('test') || relativePath.includes('spec') || ext === 'test' || ext === 'spec') {
      return 'test';
    }
    if (relativePath.includes('docs/') || relativePath.includes('documentation/') || ext === 'md' || ext === 'txt') {
      return 'docs';
    }
    if (ext === 'tf' || ext === 'hcl' || name === 'dockerfile' || name === 'docker-compose.yml' || name === 'docker-compose.yaml') {
      return 'infra';
    }
    if (ext === 'json' || ext === 'yaml' || ext === 'yml' || ext === 'toml' || name === 'makefile' || name === 'justfile') {
      return 'config';
    }
    if (['ts', 'js', 'py', 'go', 'rs', 'java', 'kt', 'cs', 'rb', 'php', 'ex', 'exs'].includes(ext || '')) {
      return 'code';
    }
    return 'other';
  }

  public search(files: ProjectFile[], query: string, topK: number): SearchMatch[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return [];
    }

    // 1. Chunk files (sliding window of 30 lines, 10 lines overlap)
    const chunks: Chunk[] = [];
    for (const file of files) {
      const lines = file.content.split(/\r?\n/);
      const chunkSize = 30;
      const overlap = 10;
      
      let i = 0;
      while (i < lines.length) {
        const startLine = i + 1;
        const endLine = Math.min(i + chunkSize, lines.length);
        const chunkLines = lines.slice(i, endLine);
        const content = chunkLines.join('\n');
        
        const tokens = this.tokenize(content);
        
        // Term frequency (TF) calculation for this chunk
        const tf: Record<string, number> = {};
        for (const token of tokens) {
          tf[token] = (tf[token] || 0) + 1;
        }

        chunks.push({
          relativePath: file.relativePath,
          startLine,
          endLine,
          content,
          tokens,
          tf
        });

        if (endLine === lines.length) {
          break;
        }
        i += (chunkSize - overlap);
      }
    }

    if (chunks.length === 0) {
      return [];
    }

    // 2. Calculate Document Frequency (DF) and Inverse Document Frequency (IDF)
    const df: Record<string, number> = {};
    for (const chunk of chunks) {
      const uniqueTokens = new Set(chunk.tokens);
      for (const token of uniqueTokens) {
        df[token] = (df[token] || 0) + 1;
      }
    }

    const idf: Record<string, number> = {};
    const totalChunks = chunks.length;
    for (const token in df) {
      idf[token] = Math.log(1 + totalChunks / df[token]);
    }

    // 3. Vectorize query
    const queryTfIdf: Record<string, number> = {};
    const queryTokenCounts: Record<string, number> = {};
    for (const token of queryTokens) {
      queryTokenCounts[token] = (queryTokenCounts[token] || 0) + 1;
    }
    
    let queryNormSq = 0;
    for (const token in queryTokenCounts) {
      const tfVal = queryTokenCounts[token] / queryTokens.length;
      const idfVal = idf[token] || 0;
      const weight = tfVal * idfVal;
      queryTfIdf[token] = weight;
      queryNormSq += weight * weight;
    }
    const queryNorm = Math.sqrt(queryNormSq);

    if (queryNorm === 0) {
      return [];
    }

    // 4. Calculate Cosine Similarity for each chunk
    const matches: SearchMatch[] = [];
    for (const chunk of chunks) {
      let dotProduct = 0;
      let chunkNormSq = 0;

      // Calculate chunk vector weights
      const chunkWeights: Record<string, number> = {};
      for (const token in chunk.tf) {
        const tfVal = chunk.tf[token] / chunk.tokens.length;
        const idfVal = idf[token] || 0;
        const weight = tfVal * idfVal;
        chunkWeights[token] = weight;
        chunkNormSq += weight * weight;
      }
      const chunkNorm = Math.sqrt(chunkNormSq);

      if (chunkNorm === 0) {
        continue;
      }

      // Compute dot product with query
      for (const token in queryTfIdf) {
        if (chunkWeights[token]) {
          dotProduct += queryTfIdf[token] * chunkWeights[token];
        }
      }

      const score = dotProduct / (queryNorm * chunkNorm);
      if (score > 0) {
        matches.push({
          relativePath: chunk.relativePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          snippet: chunk.content,
          score: Math.round(score * 1000) / 1000,
          artifactType: this.classifyArtifact(chunk.relativePath)
        });
      }
    }

    // 5. Rank and return topK
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export class EmbeddingsBackend implements SearchBackend {
  // Placeholder/hook for local vector embeddings backend in future roadmap phases
  public search(files: ProjectFile[], query: string, topK: number): SearchMatch[] {
    console.warn('EmbeddingsBackend is currently a placeholder. Falling back to empty search.');
    return [];
  }
}

export class SemanticSearchService {
  private backend: SearchBackend;

  constructor(backend: SearchBackend = new TFIDFBackend()) {
    this.backend = backend;
  }

  public search(
    files: ProjectFile[],
    query: string,
    topK = 5
  ): SearchMatch[] {
    return this.backend.search(files, query, topK);
  }
}

