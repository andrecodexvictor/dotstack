import { PatternReference } from '../models/recommendation.js';

export const PATTERN_DATABASE: Record<string, PatternReference> = {
  repository: {
    name: 'Repository Pattern',
    description: 'Decouples business logic from data access layers by providing a collection-like interface for accessing domain entities.',
    referenceUrl: 'https://github.com/topics/repository-pattern',
    examples: [
      {
        name: 'NestJS Realworld API',
        url: 'https://github.com/lujakob/nestjs-realworld-example-app',
        description: 'Demonstrates Repository and Service boundaries using TypeORM and NestJS.'
      },
      {
        name: 'Go Clean Architecture',
        url: 'https://github.com/bxcodec/go-clean-arch',
        description: 'Showcases Repository interface abstractions decoupling business rules from SQLite/Postgres databases.'
      }
    ]
  },
  cleanArch: {
    name: 'Clean Architecture (Hexagonal / Ports & Adapters)',
    description: 'Organizes application logic in concentric rings where dependency flow points inward, keeping entities and use-cases independent of external delivery mechanisms (CLI, HTTP, DB).',
    referenceUrl: 'https://github.com/topics/clean-architecture',
    examples: [
      {
        name: 'Express Clean Architecture Skeleton',
        url: 'https://github.com/fityanu/node-clean-architecture',
        description: 'A modular Express boilerplate employing strict Ports & Adapters hierarchy.'
      },
      {
        name: 'Go Clean Architecture Template',
        url: 'https://github.com/bxcodec/go-clean-arch',
        description: 'Reference implementation of Clean Architecture using standard Go packages.'
      },
      {
        name: 'Architecture Patterns in Python',
        url: 'https://github.com/cosmicpython/book',
        description: 'Accompanying code for the Cosmic Python book illustrating Unit of Work, Repository, and Service Layer patterns.'
      }
    ]
  },
  cqrs: {
    name: 'CQRS (Command Query Responsibility Segregation)',
    description: 'Separates read models from write models, allowing queries and commands to scale independently under heavy scale requirements.',
    referenceUrl: 'https://github.com/topics/cqrs',
    examples: [
      {
        name: 'NestJS CQRS Module Implementation',
        url: 'https://github.com/kamilmysliwiec/nest-cqrs-example',
        description: 'Official NestJS example showcasing commands, queries, events, and sagas.'
      }
    ]
  },
  mvt: {
    name: 'Model-View-Template (Django Architecture)',
    description: 'Standard Django architecture pattern where the Model accesses database mappings, View manages controller/routing logic, and Template compiles layout rendering.',
    referenceUrl: 'https://github.com/topics/django-boilerplate',
    examples: [
      {
        name: 'Cookiecutter Django Template',
        url: 'https://github.com/cookiecutter/cookiecutter-django',
        description: 'Industry-standard Django starter repository demonstrating production-ready MVT patterns.'
      }
    ]
  },
  dependencyInjection: {
    name: 'Dependency Injection',
    description: 'A design pattern in which an object receives other objects that it depends on, decoupling object creation from usage.',
    referenceUrl: 'https://refactoring.guru/design-patterns/dependency-injection',
    examples: [
      {
        name: 'Spring Boot API skeleton',
        url: 'https://github.com/maciejwalkowiak/spring-boot-api-project',
        description: 'Production-ready Spring Boot boilerplate demonstrating IoC, Dependency Injection, and structural configurations.'
      }
    ]
  },
  activeRecord: {
    name: 'Active Record Pattern',
    description: 'An approach to accessing data in a database where each row in a database table is wrapped in a class, closely binding database operations to domain properties.',
    referenceUrl: 'https://github.com/topics/active-record',
    examples: [
      {
        name: 'Ruby on Rails MVC Engine',
        url: 'https://github.com/rails/rails',
        description: 'The standard Active Record implementation connecting models to SQL operations natively.'
      },
      {
        name: 'Laravel Eloquent ORM',
        url: 'https://github.com/laravel/framework',
        description: 'Laravel Active Record ORM database layers.'
      }
    ]
  },
  otpSupervision: {
    name: 'Erlang/Elixir OTP Supervision Trees',
    description: 'A fault-tolerance pattern organizing actor processes hierarchically where supervisors monitor child processes and restart them in case of crashes.',
    referenceUrl: 'https://hexdocs.pm/elixir/Supervisor.html',
    examples: [
      {
        name: 'Phoenix Realtime Boilerplate',
        url: 'https://github.com/phoenixframework/phoenix',
        description: 'Demonstrates OTP application setup, supervisors, and channels for low-latency WebSocket connections.'
      }
    ]
  },
  rustConcurrency: {
    name: 'Rust Zero-Cost Abstraction & Thread Safety',
    description: 'Leveraging Rust ownership, lifetimes, and type traits (Send/Sync) to achieve safe, data-race-free asynchronous execution and low-overhead HTTP routing.',
    referenceUrl: 'https://github.com/topics/axum',
    examples: [
      {
        name: 'Axum Realworld API Example',
        url: 'https://github.com/launchbadge/realworld-axum-sqlx',
        description: 'Production-grade Axum implementation utilizing SQLx for async PostgreSQL database interactions.'
      }
    ]
  },
  ragPattern: {
    name: 'Retrieval-Augmented Generation (RAG) Architecture',
    description: 'Augmenting LLM prompts with semantic context retrieved from vector databases (like Qdrant) via embedding cosine similarity scoring.',
    referenceUrl: 'https://github.com/topics/rag',
    examples: [
      {
        name: 'Qdrant Rust/Python Examples',
        url: 'https://github.com/qdrant/qdrant',
        description: 'Reference implementations of vector semantic search and RAG loops.'
      }
    ]
  },
  islandsArch: {
    name: 'Islands Architecture',
    description: 'Optimizing web performance by rendering pages mostly as static HTML, serving dynamic widgets ("islands") that hydrate independently.',
    referenceUrl: 'https://github.com/topics/astro',
    examples: [
      {
        name: 'Astro Starter Kit',
        url: 'https://github.com/withastro/astro',
        description: 'Starter project demonstrating component-based islands architecture using React/Svelte/Vue.'
      }
    ]
  }
};

export function getPatternsForStack(backend: string, database: string, archStyle: string): PatternReference[] {
  const patterns: PatternReference[] = [];

  // Match Clean Arch
  if (archStyle === 'Modular Monolith' || backend.includes('NestJS') || backend.includes('Spring Boot') || backend.includes('ASP.NET')) {
    patterns.push(PATTERN_DATABASE.cleanArch);
  }

  // Match Repository Pattern
  if (database === 'PostgreSQL' || database === 'MongoDB' || database === 'MySQL') {
    patterns.push(PATTERN_DATABASE.repository);
  }

  // Match CQRS
  if (backend.includes('NestJS') || backend.includes('Spring Boot') || backend.includes('ASP.NET')) {
    patterns.push(PATTERN_DATABASE.cqrs);
  }

  // Match MVT for Django
  if (backend.includes('Django')) {
    patterns.push(PATTERN_DATABASE.mvt);
  }

  // Match DI
  if (backend.includes('Spring Boot') || backend.includes('NestJS')) {
    patterns.push(PATTERN_DATABASE.dependencyInjection);
  }

  // Match Active Record for Rails and Laravel
  if (backend.includes('Rails') || backend.includes('Laravel')) {
    patterns.push(PATTERN_DATABASE.activeRecord);
  }

  // Elixir Phoenix OTP
  if (backend.includes('Phoenix')) {
    patterns.push(PATTERN_DATABASE.otpSupervision);
  }

  // Rust Concurrency
  if (backend.includes('Axum') || backend.includes('Actix')) {
    patterns.push(PATTERN_DATABASE.rustConcurrency);
  }

  // AI RAG loops
  if (database === 'Qdrant') {
    patterns.push(PATTERN_DATABASE.ragPattern);
  }

  // Astro Islands
  if (backend.includes('Astro')) {
    patterns.push(PATTERN_DATABASE.islandsArch);
  }

  // Deduplicate and fallback
  if (patterns.length === 0) {
    patterns.push(PATTERN_DATABASE.cleanArch);
  }

  return patterns;
}
