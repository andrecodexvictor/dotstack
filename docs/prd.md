# Product Requirement Document (PRD) - dotstack

**Version**: 1.0.0 (MVP/V1)  
**License**: MIT  
**Status**: Approved  

---

## 1. Product Vision & Context

**dotstack** is an open-source command-line tool (CLI) and library designed to help developers and AI agents select the optimal technology stack for a given project scope and constraints. 

In modern software development, choosing a stack is a critical first step. When done manually, it is prone to developer bias, over-engineering (e.g., selecting microservices for a 2-person team), and misalignment with business goals. For AI agents (IDE agents, MCP servers, CLI harnesses), understanding and following a project's stack constraints is crucial to generating consistent, correct, and idiomatic code. 

`dotstack` acts as a deterministic, rules-based engine that consumes a simple project brief (`dotstack-project.yaml`), applies architectural heuristics, and produces a structured stack definition (`stack.yaml`) and developer documentation (`README.md`).

---

## 2. Design Goals

- **English-First**: All source code, schemas, outputs, CLI messages, and documentation must be written in English.
- **Standalone Usage**: `dotstack` is fully independent. It does not require any companion repository (e.g., `dotarchitecture` or `dotcontext`) to build, run, or recommend stacks.
- **Composable**: The outputs are clean, structured, and parseable, making it easily consumable by MCP tools, git hooks, or other CI/CD pipelines.
- **Loose Coupling**: Integration with adjacent tools is optional and based on file conventions (e.g., directory existence), not hard dependencies in `package.json`.
- **Agent-Friendly**: Markdown and YAML outputs are structured with clear keys and descriptions so that AI coding agents can read and adhere to architectural boundaries.

---

## 3. Scope of V1 (MVP)

### In Scope
- A CLI tool built with Node.js and TypeScript.
- Core rules engine fully decoupled from Node.js APIs (usable programmatically in browsers, Deno, or Bun).
- Input model validator for `dotstack-project.yaml` using Zod.
- Deterministic rules-based recommendation engine (no LLM dependencies in the core path).
- Curated design pattern database mapping recommended stacks to pattern links (RefactoringGuru, Awesome Patterns, and top-tier GitHub template/production repos).
- Project outputs:
  - If a `.context/` folder exists, write directly to `.context/dotstack/stack.yaml` and `.context/dotstack/README.md`.
  - Otherwise, write to a `.stack/` folder containing `stack.yaml` and `README.md`.
- CLI commands: `dotstack init` and `dotstack recommend`.

### Out of Scope for V1
- Dynamic rule loading from external JavaScript/TypeScript files at CLI runtime (postponed to V2).
- Native integration with LLM APIs for generating custom recommendations.
- Interactive prompt-based input collection (V1 will focus on file-based configuration).

---

## 4. Input Model Schema (`dotstack-project.yaml`)

The input file defines the project parameters and constraints. It is validated against the following schema:

```yaml
# dotstack-project.yaml example
product:
  name: "My SaaS App"
  type: "SaaS" # Enums: SaaS, API, MobileApp, CLI, InternalTool, WebApp

team:
  devs: 3 # Number of developers
  experience: "intermediate" # Enums: junior, intermediate, senior

requirements:
  scale: "medium" # Enums: low, medium, high
  latency: "normal" # Enums: normal, low-latency
  availability: "high" # Enums: normal, high-availability

constraints:
  language: "TypeScript" # Optional override (e.g., TypeScript, Python, Go, Java)
  database: "PostgreSQL" # Optional override (e.g., PostgreSQL, MongoDB, SQLite, Redis)
  cloud: "Vercel" # Optional override (e.g., AWS, Vercel, Render, Docker)
  budget: 50 # Max monthly budget in USD (optional)
```

---

## 5. Rules Engine Logic & Heuristics

The rules engine applies a series of deterministic scoring rules to determine the optimal stack.

### Heuristic Rules

1. **Architecture Style (Monolith vs. Microservices)**:
   - **Rule**: If `team.devs < 6`, heavily penalize microservices. Force a Monolith or Modular Monolith.
   - **Rationale**: Small teams waste too much time on service boundaries, deployment choreography, and network latency overhead.

2. **Frontend Selection**:
   - If `product.type` is `API` or `CLI`, set Frontend to `None`.
   - If `product.type` is `SaaS` or `WebApp`:
     - Default to React if no language preference is set.
     - If `requirements.scale` is `high`, prefer Next.js/React.
     - If simplicity is heavily favored (e.g., `team.experience == junior`), recommend Svelte or Vue.

3. **Backend Framework Selection**:
   - If `constraints.language` is set, honor it.
   - If `constraints.language` is not set:
     - If `requirements.scale == high` and `requirements.latency == low-latency`, recommend **Go (Gin/Fiber)**.
     - If `product.type == SaaS` and `requirements.scale == medium`, recommend **TypeScript (NestJS or Express)**.
     - If `team.experience == junior` or fast prototyping is needed, recommend **Python (FastAPI)**.
     - If enterprise complexity is high and scale is `high` or `medium` for a JVM preference, recommend **Java (Spring Boot)**.

4. **Database Selection**:
   - If `constraints.database` is set, honor it.
   - If `requirements.scale == low` and `product.type == CLI` or `InternalTool`, recommend **SQLite**.
   - If relational data integrity is required (SaaS, API) and scale is medium-to-high, recommend **PostgreSQL**.
   - If unstructured document storage is preferred, recommend **MongoDB**.
   - If `requirements.latency == low-latency`, recommend adding **Redis** as a caching/session tier.

5. **Deployment & Infrastructure Selection**:
   - If `constraints.cloud` is set, honor it.
   - If `product.type == WebApp` or `SaaS` and backend is serverless-friendly, recommend **Vercel** or **Netlify**.
   - If team size is small (`team.devs < 3`) and budget is low (`constraints.budget < 100`), recommend PaaS like **Render** or **Heroku**.
   - If scale is `high` and team size is `6+`, recommend **AWS** with **Docker/ECS/EKS**.

---

## 6. Design Pattern & Ecosystem Mapping

For every recommended stack, `dotstack` verifies the availability of a rich pattern ecosystem and embeds curated resources into the final output.

### Curated Pattern Database Schema
The engine contains a built-in static registry mapping stack combinations to architectural patterns and repositories:

```typescript
interface PatternReference {
  name: string;
  description: string;
  refactoringGuruUrl?: string;
  githubTopicUrl?: string;
  educationalRepos: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}
```

### Supported Mappings (Examples)

- **TypeScript (NestJS / Express) + PostgreSQL**:
  - **Patterns**: Repository Pattern, Dependency Injection, Hexagonal Architecture.
  - **RefactoringGuru**: [Repository Pattern](https://refactoring.guru/design-patterns/repository), [Dependency Injection](https://refactoring.guru/design-patterns/dependency-injection)
  - **Repos**: 
    - [nestjs-realworld-example-app](https://github.com/lujakob/nestjs-realworld-example-app) (Production NestJS realworld API with database integrations)
    - [node-clean-architecture](https://github.com/fityanu/node-clean-architecture) (Express clean architecture skeleton)
  - **GitHub Topics**: `design-patterns`, `clean-architecture`, `software-patterns`.

- **Go (Gin) + PostgreSQL**:
  - **Patterns**: Clean Architecture, Repository Pattern, Factory Pattern.
  - **Repos**:
    - [go-clean-arch](https://github.com/bxcodec/go-clean-arch) (Domain Driven Design / Clean Architecture in Go)
    - [go-gin-boilerplate](https://github.com/szfast/go-gin-boilerplate) (Gin framework structured project skeleton)

- **Python (FastAPI / Django) + PostgreSQL**:
  - **Patterns**: MVT (Model-View-Template), Repository, Service Layer.
  - **Repos**:
    - [full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) (FastAPI, SQLModel, PostgreSQL production boilerplate)

---

## 7. Outputs and Artifacts

Running `dotstack recommend` produces two key outputs:

### 1. Structured Recommendation File (`stack.yaml`)
Saved to `.context/dotstack/stack.yaml` (if `.context/` exists) or `.stack/stack.yaml` (default):

```yaml
# Generated by dotstack
metadata:
  generatedAt: "2026-07-11T22:30:00.000Z"
  project: "My SaaS App"
recommendation:
  architectureStyle: "Modular Monolith"
  frontend: "Next.js (React)"
  backend: "TypeScript (NestJS)"
  database: "PostgreSQL"
  cache: "Redis"
  deployment: "Render"
rationale:
  architectureStyle: "Monolith selected to minimize infra overhead for a team of 3 devs."
  backend: "NestJS selected to provide a structured framework for medium scale and TypeScript preference."
  database: "PostgreSQL selected for strong SQL transaction compliance and scale support."
patterns:
  - name: "Repository Pattern"
    description: "Decouples domain model from data mapping code using an abstraction layer."
    referenceUrl: "https://refactoring.guru/design-patterns/repository"
    examples:
      - name: "NestJS Realworld Example"
        url: "https://github.com/lujakob/nestjs-realworld-example-app"
  - name: "Clean Architecture"
    description: "App design pattern separated into rings: entities, use cases, controllers, external adapters."
    referenceUrl: "https://github.com/topics/clean-architecture"
    examples:
      - name: "Node Clean Architecture"
        url: "https://github.com/fityanu/node-clean-architecture"
```

### 2. Markdown File (`README.md` / `dotstack-README.md`)
Saved to `.context/dotstack/README.md` or `.stack/README.md` to document the architectural rules for human developers and AI agents:

```markdown
# Recommended Architecture: Modular Monolith

This project uses the following technology stack recommended by `dotstack`:

- **Frontend**: Next.js (React)
- **Backend**: TypeScript (NestJS)
- **Database**: PostgreSQL (with Redis cache)
- **Deployment**: Render

## Rationale
- **Monolith over Microservices**: Selected to maximize iteration speed for 3 developers. Avoid splitting the codebase into microservices until the team exceeds 6-8 devs.
- **NestJS**: Ideal for structured TypeScript APIs, enforcing dependency injection and decorators which AI agents can easily understand.

## Design Patterns & Reference Codebases
Ensure you follow these architectural patterns when adding new features:

1. **Repository Pattern**
   - Decouples database access from business logic.
   - Reference: [RefactoringGuru Repository](https://refactoring.guru/design-patterns/repository)
   - Code Example: [NestJS Realworld App](https://github.com/lujakob/nestjs-realworld-example-app)

2. **Clean Architecture**
   - Keeps business logic independent of external databases or frameworks.
   - Example Repo: [Node Clean Architecture](https://github.com/fityanu/node-clean-architecture)
```

---

## 8. CLI UX & Command Reference

The CLI is designed for a premium developer experience. It is fast, colorful, and outputs clear feedback.

### `dotstack init`
Generates a template `dotstack-project.yaml` in the current working directory.
- **Output**: Writes file, prints a success message with instructions.

### `dotstack recommend`
Analyzes the configuration and generates outputs.
- **Usage**: `dotstack recommend [-f/--file <path>]`
- **Defaults**: `-f` defaults to `dotstack-project.yaml` in the current directory.
- **Actions**:
  1. Parses the yaml configuration.
  2. Runs the deterministic Rules Engine.
  3. Displays a formatted table of recommended technologies in the terminal.
  4. Automatically detects if `./.context/` directory exists.
     - If YES: Writes outputs to `./.context/dotstack/stack.yaml` and `./.context/dotstack/README.md`.
     - If NO: Writes outputs to `./.stack/stack.yaml` and `./.stack/README.md`.
