export interface PatternExample {
  name: string;
  url: string;
  description?: string;
}

export interface PatternReference {
  name: string;
  description: string;
  referenceUrl?: string;
  examples: PatternExample[];
}

export interface StackRecommendation {
  metadata: {
    generatedAt: string;
    project: string;
  };
  recommendation: {
    architectureStyle: string;
    frontend: string;
    backend: string;
    database: string;
    cache?: string;
    aiFramework?: string;
    deployment: string;
  };
  rationale: {
    architectureStyle: string;
    frontend: string;
    backend: string;
    database: string;
    cache?: string;
    aiFramework?: string;
    deployment: string;
  };
  patterns: PatternReference[];
  risks: string[];
}

export interface ScoringRegistry {
  architectureStyle: Record<string, number>;
  frontend: Record<string, number>;
  backend: Record<string, number>;
  database: Record<string, number>;
  cache: Record<string, number>;
  aiFramework: Record<string, number>;
  deployment: Record<string, number>;
  rationales: Record<string, string>;
  risks: string[];
}
