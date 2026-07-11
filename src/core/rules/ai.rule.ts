import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class AiRule implements Rule {
  name = 'AI Framework Rule';
  description = 'Decides whether to recommend LangChain, LlamaIndex, or LangGraph for AI-enabled applications.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const name = brief.product.name.toLowerCase();
    const database = brief.constraints.database;
    
    // Check if the application features AI or vector storage
    const isAiApp = name.includes('ai') || 
                    name.includes('vector') || 
                    name.includes('rag') || 
                    name.includes('embedding') || 
                    name.includes('search') || 
                    name.includes('agent') || 
                    name.includes('llm') ||
                    database === 'Qdrant';

    if (!isAiApp) {
      registry.aiFramework['None'] += 100;
      registry.rationales.aiFramework = 'No AI/LLM framework recommended for standard application scopes.';
      return;
    }

    // Baselines for AI applications
    registry.aiFramework['LangChain'] += 20;
    registry.aiFramework['LlamaIndex'] += 15;
    registry.aiFramework['LangGraph'] += 10;
    registry.aiFramework['None'] -= 100;

    // 1. Agent workflows require LangGraph
    if (name.includes('agent') || name.includes('flow') || name.includes('graph')) {
      registry.aiFramework['LangGraph'] += 50;
      registry.aiFramework['LangChain'] += 10;
      registry.rationales.aiFramework = 'LangGraph recommended to build stateful, multi-agent orchestrations with cyclic graphs.';
      return;
    }

    // 2. Search/Embedding/RAG apps require LlamaIndex
    if (name.includes('search') || name.includes('embedding') || name.includes('index') || database === 'Qdrant') {
      registry.aiFramework['LlamaIndex'] += 50;
      registry.rationales.aiFramework = 'LlamaIndex recommended for optimized document indexing, ingestion, and RAG search performance.';
      return;
    }

    // 3. General AI application
    registry.aiFramework['LangChain'] += 40;
    registry.rationales.aiFramework = 'LangChain recommended as the industry-standard general orchestrator for chains and LLM connections.';
  }
}
