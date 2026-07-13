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
  },
  eventSourcing: {
    name: 'Event Sourcing',
    description: 'Guarantees that all changes to application state are stored as a sequence of events, ensuring auditability and historical reconstruction.',
    referenceUrl: 'https://microservices.io/patterns/data/event-sourcing.html',
    examples: [
      {
        name: 'EventStoreDB Examples',
        url: 'https://github.com/EventStore/EventStore',
        description: 'Operational database designed specifically for Event Sourcing and Event-Driven Architectures.'
      }
    ]
  },
  outboxPattern: {
    name: 'Transactional Outbox Pattern',
    description: 'Solves the dual-write problem in distributed systems by committing database changes and events inside the same transaction.',
    referenceUrl: 'https://microservices.io/patterns/data/transactional-outbox.html',
    examples: [
      {
        name: 'Debezium Outbox Example',
        url: 'https://github.com/debezium/debezium-examples',
        description: 'Demonstrates change data capture (CDC) from an outbox table using Kafka Connect.'
      }
    ]
  },
  sagaPattern: {
    name: 'Saga Pattern',
    description: 'Manages distributed transactions across multiple microservices using a sequence of local transactions and compensating actions.',
    referenceUrl: 'https://microservices.io/patterns/data/saga.html',
    examples: [
      {
        name: 'Temporal.io Workflows',
        url: 'https://github.com/temporalio/samples-typescript',
        description: 'Showcases robust distributed transaction orchestration using Temporal workflow definitions.'
      }
    ]
  },
  stranglerFig: {
    name: 'Strangler Fig Pattern',
    description: 'Safely migrates legacy codebases to new architectures by incrementally replacing specific endpoints or features with new implementations behind a gateway.',
    referenceUrl: 'https://martinfowler.com/bliki/StranglerFigApplication.html',
    examples: [
      {
        name: 'Nginx API Gateway Skel',
        url: 'https://github.com/nginxinc/kubernetes-ingress',
        description: 'API routing routing setup demonstrating traffic splitting between legacy VMs and new containers.'
      }
    ]
  },
  bff: {
    name: 'Backend For Frontend (BFF) Pattern',
    description: 'Creates a custom API layer tailored specifically for unique clients (e.g. Mobile app vs Desktop Web) to aggregate API payloads and minimize network latency.',
    referenceUrl: 'https://samnewman.io/patterns/architectural/bff/',
    examples: [
      {
        name: 'Apollo GraphQL Gateway',
        url: 'https://github.com/apollographql/supergraph-demo',
        description: 'Consolidates underlying microservice APIs into client-optimized GraphQL queries.'
      }
    ]
  },
  sidecar: {
    name: 'Sidecar and Ambassador Patterns',
    description: 'Deploys auxiliary helper containers alongside the main application pod to handle cross-cutting concerns like logging, service mesh mTLS, and network proxies.',
    referenceUrl: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar',
    examples: [
      {
        name: 'Envoy Proxy configurations',
        url: 'https://github.com/envoyproxy/envoy',
        description: 'Demonstrates sidecar traffic filtering, circuit breaking, and load balancing.'
      }
    ]
  },
  circuitBreaker: {
    name: 'Circuit Breaker Pattern',
    description: 'Prevents cascading failures in distributed systems by immediately failing remote calls when the downstream service is unhealthy, allowing it to recover.',
    referenceUrl: 'https://martinfowler.com/bliki/CircuitBreaker.html',
    examples: [
      {
        name: 'Hystrix / Polly resilience',
        url: 'https://github.com/App-vNext/Polly',
        description: 'Examples of Circuit Breaker, Bulkhead, and Retry patterns implemented in .NET.'
      }
    ]
  },
  zeroTrust: {
    name: 'Zero Trust Architecture',
    description: 'Removes implicit trust, requiring continuous validation, transport encryption (mTLS), and least-privilege role bindings at every service boundary.',
    referenceUrl: 'https://www.nist.gov/publications/zero-trust-architecture',
    examples: [
      {
        name: 'Spire / SPIFFE auth',
        url: 'https://github.com/spiffe/spire',
        description: 'Implements SPIFFE Zero Trust identity issuance and transport verification.'
      }
    ]
  },
  customHooksArch: {
    name: 'Custom Hooks Architecture (State & Effect Decoupling)',
    description: 'Extracts UI component state management, async side-effects, and orchestration workflows into pure custom hooks. This keeps views focused solely on layout/rendering, making the codebase highly testable and structured for AI agent ingestion.',
    referenceUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
    examples: [
      {
        name: 'Awesome React Hooks Collection',
        url: 'https://github.com/rehooks/awesome-react-hooks',
        description: 'Curated list of standard and custom hooks decoupling side-effects and state.'
      },
      {
        name: 'Vue Composition API Hooks Patterns',
        url: 'https://github.com/vuejs/composition-api',
        description: 'Demonstrates composition functions that decouple logic from HTML templates.'
      }
    ]
  },
  designTokensSystem: {
    name: 'Design Tokens & Theme Consistency',
    description: 'Abstracts interface attributes (colors, typography, margins, transitions) into static design tokens. Ensures ergonomic UI consistency, robust accessibility contrast, and seamless light/dark mode adaptation.',
    referenceUrl: 'https://m3.material.io/foundations/design-tokens/overview',
    examples: [
      {
        name: 'Chakra UI Styling Tokens',
        url: 'https://github.com/chakra-ui/chakra-ui',
        description: 'Flexible component styling engine driven by unified design tokens.'
      },
      {
        name: 'Radix UI Primitives',
        url: 'https://github.com/radix-ui/primitives',
        description: 'Unstyled, accessible UI components mapping CSS tokens to layout structures.'
      }
    ]
  },
  cognitiveLoadMinimization: {
    name: 'Cognitive Load Minimization & UX Ergonomics',
    description: 'Ergonomic interface design prioritizing progressive disclosure, logical keyboard navigation order, explicit active/focus states, and auto-focus fields to minimize input friction and cognitive load.',
    referenceUrl: 'https://www.nngroup.com/articles/progressive-disclosure/',
    examples: [
      {
        name: 'WAI-ARIA Authoring Practices',
        url: 'https://github.com/w3c/aria-practices',
        description: 'Design patterns and ergonomics guidelines for accessible, keyboard-friendly interfaces.'
      },
      {
        name: 'Shadcn UI Accessible Components',
        url: 'https://github.com/shadcn-ui/ui',
        description: 'Accessible UI components styled with Tailwind CSS, built on Radix primitives.'
      }
    ]
  },
  systemsMemoryManagement: {
    name: 'RAII & Systems Memory Management',
    description: 'Resource Acquisition Is Initialization (RAII) and smart pointer patterns in C/C++ to ensure automatic memory and socket release, eliminating leaks in native server environments.',
    referenceUrl: 'https://en.cppreference.com/w/cpp/language/raii',
    examples: [
      {
        name: 'Drogon Web Framework Examples',
        url: 'https://github.com/drogonframework/drogon',
        description: 'Modern C++17/20 controller patterns utilizing smart memory management.'
      }
    ]
  }
};

export function getPatternsForStack(
  backend: string,
  database: string,
  archStyle: string,
  additionalInfo?: {
    hasMessaging?: boolean;
    hasKubernetes?: boolean;
    isMobile?: boolean;
    isHardened?: boolean;
    hasFrontend?: boolean;
    isAiSupported?: boolean;
  }
): PatternReference[] {
  const patterns: PatternReference[] = [];

  // Match RAII & Systems Memory Management for C/C++ backends
  if (backend.includes('Drogon') || backend.includes('Crow') || backend.includes('C ')) {
    patterns.push(PATTERN_DATABASE.systemsMemoryManagement);
  }

  // Match UI/UX design patterns & custom hooks
  if (additionalInfo?.hasFrontend) {
    patterns.push(PATTERN_DATABASE.designTokensSystem);
    patterns.push(PATTERN_DATABASE.cognitiveLoadMinimization);
    patterns.push(PATTERN_DATABASE.customHooksArch);
  }

  // If AI supported, highlight Hook Architecture as highly recommended for Agentic coding
  if (additionalInfo?.isAiSupported && !patterns.some(p => p && p.name === PATTERN_DATABASE.customHooksArch.name)) {
    patterns.push(PATTERN_DATABASE.customHooksArch);
  }

  // Match Clean Arch
  if (archStyle === 'Modular Monolith' || backend.includes('NestJS') || backend.includes('Spring Boot') || backend.includes('ASP.NET')) {
    patterns.push(PATTERN_DATABASE.cleanArch);
  }

  // Match Repository Pattern
  if (database.includes('PostgreSQL') || database.includes('MongoDB') || database.includes('MySQL') || database.includes('Aurora')) {
    patterns.push(PATTERN_DATABASE.repository);
  }

  // Match CQRS
  if (backend.includes('NestJS') || backend.includes('Spring Boot') || backend.includes('ASP.NET') || archStyle === 'Microservices') {
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
  if (database.includes('Qdrant') || database.includes('Pinecone') || database.includes('Weaviate')) {
    patterns.push(PATTERN_DATABASE.ragPattern);
  }

  // Astro Islands
  if (backend.includes('Astro')) {
    patterns.push(PATTERN_DATABASE.islandsArch);
  }

  // Event Driven Patterns
  if (additionalInfo?.hasMessaging || archStyle === 'Microservices') {
    patterns.push(PATTERN_DATABASE.eventSourcing);
    patterns.push(PATTERN_DATABASE.outboxPattern);
    patterns.push(PATTERN_DATABASE.sagaPattern);
  }

  // Sidecar for Kubernetes
  if (additionalInfo?.hasKubernetes) {
    patterns.push(PATTERN_DATABASE.sidecar);
  }

  // Mobile patterns (BFF)
  if (additionalInfo?.isMobile) {
    patterns.push(PATTERN_DATABASE.bff);
  }

  // Circuit Breaker for Microservices or Low Latency
  if (archStyle === 'Microservices' || additionalInfo?.hasMessaging) {
    patterns.push(PATTERN_DATABASE.circuitBreaker);
  }

  // Zero Trust for hardened setups
  if (additionalInfo?.isHardened) {
    patterns.push(PATTERN_DATABASE.zeroTrust);
  }

  // Deduplicate and fallback
  if (patterns.length === 0) {
    patterns.push(PATTERN_DATABASE.cleanArch);
  }

  // Standard de-duplication by name
  const seen = new Set<string>();
  return patterns.filter(p => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}
