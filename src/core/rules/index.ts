import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export interface Rule {
  name: string;
  description: string;
  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void;
}

export function createInitialScores(): ScoringRegistry {
  return {
    architectureStyle: {
      Monolith: 0,
      'Modular Monolith': 0,
      Microservices: 0
    },
    frontend: {
      None: 0,
      React: 0,
      'Next.js (React)': 0,
      Vue: 0,
      Svelte: 0
    },
    backend: {
      'TypeScript (Express)': 0,
      'TypeScript (NestJS)': 0,
      'Python (FastAPI)': 0,
      'Python (Django)': 0,
      'Go (Gin)': 0,
      'Java (Spring Boot)': 0
    },
    database: {
      PostgreSQL: 0,
      MongoDB: 0,
      SQLite: 0
    },
    cache: {
      None: 0,
      Redis: 0
    },
    deployment: {
      Vercel: 0,
      Render: 0,
      AWS: 0,
      'Docker (Self-hosted)': 0
    },
    rationales: {
      architectureStyle: '',
      frontend: '',
      backend: '',
      database: '',
      cache: '',
      deployment: ''
    },
    risks: []
  };
}
