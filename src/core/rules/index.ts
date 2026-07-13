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
      Astro: 0,
      Remix: 0,
      Qwik: 0
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
      'CSharp (ASP.NET Core)': 0,
      'Scala (Play Framework)': 0,
      'C++ (Drogon)': 0,
      'C++ (Crow)': 0,
      'C (Native/CGI)': 0
    },
    database: {
      PostgreSQL: 0,
      MongoDB: 0,
      SQLite: 0,
      MySQL: 0,
      Cassandra: 0,
      Neo4j: 0,
      Qdrant: 0,
      DynamoDB: 0,
      MariaDB: 0,
      CockroachDB: 0,
      'Amazon Aurora (PostgreSQL)': 0,
      'Amazon Aurora (MySQL)': 0,
      'AWS RDS (PostgreSQL)': 0,
      'AWS RDS (MySQL)': 0,
      'Google Cloud SQL': 0,
      'Google Cloud Spanner': 0,
      'Azure SQL Database': 0,
      'Azure CosmosDB': 0,
      Firestore: 0,
      'Supabase (PostgreSQL)': 0,
      PlanetScale: 0,
      Neon: 0,
      TiDB: 0
    },
    cache: {
      None: 0,
      Redis: 0,
      Memcached: 0,
      Varnish: 0,
      'CDN (Cloudflare/CloudFront)': 0
    },
    aiFramework: {
      None: 0,
      LangChain: 0,
      LlamaIndex: 0,
      LangGraph: 0,
      CrewAI: 0,
      AutoGen: 0,
      Chroma: 0,
      Pinecone: 0,
      Weaviate: 0
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
      'Docker (Self-hosted)': 0,
      Railway: 0
    },
    observability: {
      None: 0,
      OpenTelemetry: 0,
      Prometheus: 0,
      Grafana: 0,
      Loki: 0,
      Jaeger: 0,
      Sentry: 0,
      Datadog: 0,
      'New Relic': 0,
      'AWS CloudWatch': 0,
      'ELK Stack': 0
    },
    messaging: {
      None: 0,
      Kafka: 0,
      RabbitMQ: 0,
      NATS: 0,
      'AWS SQS': 0,
      'Google Pub/Sub': 0,
      'Redis Streams': 0,
      'Amazon Kinesis': 0,
      EventBridge: 0
    },
    testing: {
      Vitest: 0,
      Jest: 0,
      Pytest: 0,
      JUnit: 0,
      k6: 0,
      Locust: 0,
      Gatling: 0,
      Playwright: 0,
      Cypress: 0,
      Pact: 0
    },
    auth: {
      None: 0,
      Auth0: 0,
      Keycloak: 0,
      'Supabase Auth': 0,
      'AWS Cognito': 0,
      'Firebase Auth': 0,
      Clerk: 0,
      'NextAuth.js': 0
    },
    security: {
      None: 0,
      Semgrep: 0,
      SonarQube: 0,
      Trivy: 0,
      Snyk: 0,
      Dependabot: 0,
      'HashiCorp Vault': 0,
      'AWS KMS': 0,
      'AWS WAF': 0
    },
    orchestration: {
      None: 0,
      'Kubernetes (EKS/GKE/AKS)': 0,
      'Docker Compose': 0,
      'AWS ECS/Fargate': 0,
      'Cloud Run': 0,
      'App Runner': 0,
      Nomad: 0
    },
    mobile: {
      None: 0,
      'React Native': 0,
      Flutter: 0,
      SwiftUI: 0,
      'Kotlin/Jetpack Compose': 0,
      '.NET MAUI': 0,
      Expo: 0,
      Capacitor: 0,
      Tauri: 0,
      Electron: 0
    },
    rationales: {
      architectureStyle: '',
      frontend: '',
      backend: '',
      database: '',
      cache: '',
      aiFramework: '',
      deployment: '',
      observability: '',
      messaging: '',
      testing: '',
      auth: '',
      security: '',
      orchestration: '',
      mobile: ''
    },
    risks: []
  };
}

