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
      'Nuxt (Vue)': 0,
      Svelte: 0,
      SvelteKit: 0,
      Angular: 0,
      SolidJS: 0,
      Astro: 0
    },
    backend: {
      'TypeScript (Express)': 0,
      'TypeScript (NestJS)': 0,
      'TypeScript (Fastify)': 0,
      'TypeScript (Hono)': 0,
      'Python (FastAPI)': 0,
      'Python (Django)': 0,
      'Python (Flask)': 0,
      'Go (Gin)': 0,
      'Go (Fiber)': 0,
      'Go (Echo)': 0,
      'Rust (Axum)': 0,
      'Rust (Actix-web)': 0,
      'Ruby (Ruby on Rails)': 0,
      'Elixir (Phoenix)': 0,
      'PHP (Laravel)': 0,
      'PHP (Symfony)': 0,
      'Java (Spring Boot)': 0,
      'Kotlin (Ktor)': 0,
      'CSharp (ASP.NET Core)': 0
    },
    database: {
      PostgreSQL: 0,
      MongoDB: 0,
      SQLite: 0,
      MySQL: 0,
      Cassandra: 0,
      Neo4j: 0,
      Qdrant: 0,
      DynamoDB: 0
    },
    cache: {
      None: 0,
      Redis: 0,
      Memcached: 0
    },
    aiFramework: {
      None: 0,
      LangChain: 0,
      LlamaIndex: 0,
      LangGraph: 0
    },
    deployment: {
      Vercel: 0,
      Render: 0,
      AWS: 0,
      GCP: 0,
      Azure: 0,
      'Fly.io': 0,
      'Cloudflare Workers': 0,
      Supabase: 0,
      'Docker (Self-hosted)': 0
    },
    rationales: {
      architectureStyle: '',
      frontend: '',
      backend: '',
      database: '',
      cache: '',
      aiFramework: '',
      deployment: ''
    },
    risks: []
  };
}
