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
    observability?: string;
    messaging?: string;
    testing?: string;
    auth?: string;
    security?: string;
    orchestration?: string;
    mobile?: string;
  };
  rationale: {
    architectureStyle: string;
    frontend: string;
    backend: string;
    database: string;
    cache?: string;
    aiFramework?: string;
    deployment: string;
    observability?: string;
    messaging?: string;
    testing?: string;
    auth?: string;
    security?: string;
    orchestration?: string;
    mobile?: string;
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
  observability: Record<string, number>;
  messaging: Record<string, number>;
  testing: Record<string, number>;
  auth: Record<string, number>;
  security: Record<string, number>;
  orchestration: Record<string, number>;
  mobile: Record<string, number>;
  rationales: Record<string, string>;
  risks: string[];
}

