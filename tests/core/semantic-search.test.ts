import { describe, it, expect } from 'vitest';
import { SemanticSearchService } from '../../src/core/services/semantic-search.service.js';
import { ProjectFile } from '../../src/core/ports/file-system.port.js';

describe('SemanticSearchService TF-IDF Vector Search', () => {
  const searchService = new SemanticSearchService();

  const mockFiles: ProjectFile[] = [
    {
      relativePath: 'src/core/services/recommendation.service.ts',
      content: `
        import { ProjectBriefSchema } from '../models/brief.js';
        export class RecommendationService {
          private rules = [new ArchitectureRule(), new DatabaseRule()];
          public recommend(brief: unknown) {
            // Evaluates architectural heuristics and runs the rules engine pipeline
            // Return stack recommendations and design pattern registry links
          }
        }
      `
    },
    {
      relativePath: 'src/adapters/cli/index.ts',
      content: `
        import { Command } from 'commander';
        // Commander CLI command handler for dotstack
        // Prints a beautiful formatted ASCII recommendation table to the console terminal
      `
    },
    {
      relativePath: 'README.md',
      content: `
        # dotstack
        This is a technology stack recommendation engine built for human developers and AI coding agents.
        Exposes CLI commands and a programmatic TypeScript SDK.
      `
    }
  ];

  it('should rank files containing query terms higher', () => {
    const query = 'rules engine recommend';
    const results = searchService.search(mockFiles, query, 3);

    expect(results.length).toBeGreaterThan(0);
    // The service file is the only one containing 'rules engine' or 'recommend'
    expect(results[0].relativePath).toBe('src/core/services/recommendation.service.ts');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('should correctly search for CLI term', () => {
    const query = 'cli commander table';
    const results = searchService.search(mockFiles, query, 2);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].relativePath).toBe('src/adapters/cli/index.ts');
  });

  it('should return empty matches for empty queries or only stop words', () => {
    const query = 'the and of';
    const results = searchService.search(mockFiles, query, 5);

    expect(results.length).toBe(0);
  });
});
