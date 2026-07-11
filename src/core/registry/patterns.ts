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
  }
};

export function getPatternsForStack(backend: string, database: string, archStyle: string): PatternReference[] {
  const patterns: PatternReference[] = [];

  // Match Clean Arch
  if (archStyle === 'Modular Monolith' || backend.includes('NestJS') || backend.includes('Spring Boot')) {
    patterns.push(PATTERN_DATABASE.cleanArch);
  }

  // Match Repository Pattern
  if (database === 'PostgreSQL' || database === 'MongoDB') {
    patterns.push(PATTERN_DATABASE.repository);
  }

  // Match CQRS
  if (backend.includes('NestJS') || backend.includes('Spring Boot')) {
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

  // Deduplicate and fallback
  if (patterns.length === 0) {
    patterns.push(PATTERN_DATABASE.cleanArch); // Clean Architecture as general fallback
  }

  return patterns;
}
