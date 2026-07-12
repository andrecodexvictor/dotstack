# Internal Architecture Proposal - dotstack

This document describes the architectural layout of `dotstack`. To support clean testing, embeddability, and programmatic usage by other tools or AI agents, `dotstack` is structured using **Ports and Adapters (Hexagonal Architecture)**.

---

## 1. Architectural Diagram

```
           +---------------------------------------------+
           |              DRIVING ADAPTERS               |
           |                                             |
           |   [CLI Adapter]          [MCP Adapter]      |
           |    (Commander)            (Future MCP)      |
           |         |                       |           |
           +---------|-----------------------|-----------+
                     |                       |
                     v                       v
           +---------------------------------------------+
           |                DRIVING PORTS                |
           |                                             |
           |        [RecommendationUseCase Port]         |
           |                      |                      |
           +----------------------|----------------------+
                                  |
                                  v
           +---------------------------------------------+
           |                 CORE DOMAIN                 |
           |                                             |
           |   [RecommendationService]                   |
           |             |                               |
           |             v                               |
           |      [Rules Engine]                         |
           |       - rules/*                             |
           |             |                               |
           |             v                               |
           |      [Pattern Registry]                     |
           |                                             |
           +----------------------|----------------------+
                                  |
                                  v
           +---------------------------------------------+
           |                DRIVEN PORTS                 |
           |                                             |
           |     [FileSystemPort]      [LoggerPort]      |
           |            |                    |           |
           +------------|--------------------|-----------+
                        |                    |
                        v                    v
           +---------------------------------------------+
           |              DRIVEN ADAPTERS                |
           |                                             |
           |   [NodeFS Adapter]      [ConsoleLogger]     |
           |    (fs/promises)          (picocolors)      |
           |                                             |
           +---------------------------------------------+
```

---

## 2. Directory Structure

```
dotstack/
├── docs/                      # Documentation (PRD, Architecture, Backlog)
├── src/
│   ├── core/                  # Pure TypeScript domain logic (No Node.js API imports)
│   │   ├── models/            # Domain interfaces (ProjectBrief, StackRecommendation)
│   │   ├── rules/             # Rule implementations & scoring weights
│   │   │   ├── index.ts
│   │   │   ├── team-size.rule.ts
│   │   │   ├── scale.rule.ts
│   │   │   └── database.rule.ts
│   │   ├── registry/          # Curated design patterns & repos database
│   │   │   └── patterns.ts
│   │   ├── services/          # Recommendation orchestrator
│   │   │   └── recommendation.service.ts
│   │   └── ports/             # Boundaries/interfaces for side-effects
│   │       ├── file-system.port.ts
│   │       └── logger.port.ts
│   │
│   ├── adapters/              # Environment-specific implementations
│   │   ├── cli/               # CLI driver adapter
│   │   │   ├── commands/
│   │   │   └── index.ts       # CLI entrypoint
│   │   ├── fs/                # Node.js file system implementation
│   │   │   └── node-fs.adapter.ts
│   │   └── logger/            # Console logging implementation
│   │       └── console-logger.adapter.ts
│   │
│   └── index.ts               # Library entrypoint for SDK usage
├── tests/                     # Unit and integration tests
│   ├── core/
│   └── adapters/
├── package.json
└── tsconfig.json
```

---

## 3. Component Details

### A. Core Domain (`src/core`)
Contains all the core rules and logic. It has zero external dependencies other than verification helpers (like `zod`). It must not import `fs`, `path`, or `process`.

- **Rules Engine (`src/core/rules`)**:
  Rules are represented as modular functions or classes conforming to a common interface:
  ```typescript
  export interface Rule {
    name: string;
    description: string;
    evaluate(brief: ProjectBrief, currentScores: ScoringRegistry): void;
  }
  ```
  This allows unit testing individual rules in complete isolation by mocking the input `ProjectBrief`.

- **Pattern Registry (`src/core/registry`)**:
  A static database cataloging design patterns, descriptions, reference links (RefactoringGuru, GitHub Topics), and curated GitHub boilerplates/templates for different stack configurations.

- **Audit Engine (`src/core/audit`)**:
  An analysis engine that scans project workspace dependency trees and configurations, compares actual technologies to recommendations, and scores stack alignment.

- **Migration Planner (`src/core/migrate`)**:
  Generates phased blueprints to migrate from current to target stack architectures, estimating hours and assessing potential risks.

- **Report Generator (`src/core/report`)**:
  Compiles complete Architecture Decision Records (ADRs) and stack metrics in both JSON and Markdown formats.

- **Semantic Search Backends (`src/core/services/semantic-search.service`)**:
  Exposes a pluggable `SearchBackend` interface enabling both the offline `TFIDFBackend` and potential future `EmbeddingsBackend` vector search algorithms.

### B. Ports (`src/core/ports`)
Interfaces that define how the core interacts with the outside world.

- **`FileSystemPort`**: 
  Specifies methods to read the brief YAML/JSON and write the generated YAML and Markdown outputs.
- **`LoggerPort`**: 
  Specifies methods for logging informational messages or warning developer/agent users of risks (e.g. over-engineering).

### C. Adapters (`src/adapters`)
Realizations of the ports for specific runtime environments.

- **`NodeFileSystemAdapter`**:
  Uses Node's `fs/promises` to read files, parses input using `js-yaml`, and writes YAML/Markdown files to the workspace path. It contains the logic to:
  1. Detect the existence of `.context/` in the workspace root.
  2. If present, write output to `.context/dotstack/`.
  3. If absent, write output to `.stack/`.
  
- **`CLI Adapter (Commander)`**:
  The orchestrator of the CLI application. Resolves the CLI options, instantiates the `NodeFileSystemAdapter` and `ConsoleLoggerAdapter`, invokes the `RecommendationService` from the core domain, and triggers writing output files. Supports dry-runs, custom formatting (json, markdown), and custom outputs.

---

## 4. SDK & API Design

To allow future MCP servers or other developer packages to import `dotstack` directly without running the CLI, the entrypoint `src/index.ts` exposes a clean programmatic API:

```typescript
import { RecommendationService } from './core/services/recommendation.service.js';
import { ProjectBrief } from './core/models/brief.js';
import { AuditEngine } from './core/audit/index.js';
import { MigrationPlanner } from './core/migrate/index.js';

// Programmatic recommend API
export function getStackRecommendation(brief: ProjectBrief) {
  const service = new RecommendationService();
  return service.recommend(brief);
}
```
This is fully compatible with serverless/browser runtimes, allowing custom user interfaces or online stack calculators to embed `dotstack` directly.
