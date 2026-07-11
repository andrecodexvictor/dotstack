# Backlog & Task List - dotstack V1 (MVP)

This backlog organizes the implementation tasks for the `dotstack` project. The tickets are structured sequentially, ensuring a solid architectural foundation is laid down before building CLI features.

---

## Category 1: Infra & Setup

### TICKET-1.1: Initialize Project, TypeScript, and Tooling
* **Description**: Set up the repository workspace, including Node.js package setup, TypeScript configuration, formatting (Prettier), and linting (ESLint).
* **Acceptance Criteria**:
  * `package.json` contains metadata (MIT licensed) and script targets (`build`, `test`, `lint`, `format`).
  * `tsconfig.json` compiles TypeScript from `src/` to `dist/` with ES2022 compatibility and strict checking enabled.
  * Running `npm run build` runs successfully with no errors.
  * Linting and formatting scripts execute without issues.

### TICKET-1.2: Define Core Domain Models and Zod Schemas
* **Description**: Implement the foundational TypeScript interfaces for `ProjectBrief`, `StackRecommendation`, and `PatternReference`. Create Zod validation schemas to validate the input configuration.
* **Acceptance Criteria**:
  * Define schemas under `src/core/models/`.
  * Input schema validates enums (e.g., product type, team experience, scale).
  * Unit tests prove that valid inputs pass validation and invalid inputs throw descriptive Zod errors.

---

## Category 2: Rules Engine

### TICKET-2.1: Implement Rule Interface & Recommendation Orchestrator
* **Description**: Define the `Rule` interface and construct the `RecommendationService` class that loads and applies a list of rules in a deterministic pipeline.
* **Acceptance Criteria**:
  * Rules run sequentially, mutating a state container representing scores.
  * The orchestration logic has no Node.js dependencies (pure JS/TS runtime compatible).

### TICKET-2.2: Implement Core Scoring Rules
* **Description**: Write the initial set of deterministic rules:
  1. *Architecture Monolith Rule*: Forces monolith/modular monolith if team size is less than 6 developers.
  2. *Frontend Rule*: Maps product types to React, Next.js, Svelte, or Vue based on scale, experience, and budget.
  3. *Backend Framework Rule*: Scores Express, NestJS, FastAPI, Django, Gin, and Spring Boot.
  4. *Database & Caching Rule*: Evaluates PostgreSQL, SQLite, MongoDB, and Redis based on constraints, latency, and scale.
  5. *Cloud/Hosting Rule*: Recommends Vercel, Render, or AWS.
* **Acceptance Criteria**:
  * Rules are fully deterministic; the same input object always yields identical scores.
  * Edge cases (e.g., extremely low budget, high latency requirements) are handled correctly.

### TICKET-2.3: Build Curated Pattern & Repository Registry
* **Description**: Create the static, built-in database linking recommended technology combinations to design patterns and educational/production GitHub repositories.
* **Acceptance Criteria**:
  * Mappings exist for the major stacks (e.g., NestJS/Express, FastAPI, Gin, Spring Boot) with links to RefactoringGuru URLs and specific high-quality GitHub repos.
  * Resolving stack recommendation successfully appends pattern arrays to the final output model.

---

## Category 3: CLI

### TICKET-3.1: Implement CLI Framework & `init` Command
* **Description**: Integrate the `commander` package. Implement the `dotstack init` command to create a default `dotstack-project.yaml` file in the current working directory.
* **Acceptance Criteria**:
  * Running `dotstack init` creates a template `dotstack-project.yaml` containing commented documentation of all valid options.
  * CLI displays a beautiful green success message using terminal coloring.

### TICKET-3.2: Implement `recommend` Command Console Output
* **Description**: Parse arguments for `dotstack recommend [-f <path>]`. Invoke the core validation and orchestrator, printing a clean, formatted ASCII table of the results to the terminal.
* **Acceptance Criteria**:
  * Running `dotstack recommend` prints the recommended frontend, backend, database, cache, deployment target, and a short summary of rationales in a table format.
  * Informational warnings are printed if high risk factors are detected (e.g., microservices selected for small teams).

---

## Category 4: Integration

### TICKET-4.1: Implement Ports & Node File System Adapter
* **Description**: Define the `FileSystemPort` interface and implement the `NodeFileSystemAdapter`. Add file detection logic for the `./.context/` directory.
* **Acceptance Criteria**:
  * If `./.context/` exists, write outputs directly to `./.context/dotstack/stack.yaml` and `./.context/dotstack/README.md`.
  * If `./.context/` is absent, create `./.stack/` and write outputs to `./.stack/stack.yaml` and `./.stack/README.md`.
  * Outputs match the YAML and Markdown structures defined in the PRD.

---

## Category 5: Documentation & Examples

### TICKET-5.1: Write Unit & Integration Tests
* **Description**: Set up a test framework (e.g., Vitest or Jest) and write tests verifying the rules logic, Zod validation, and adapter output paths.
* **Acceptance Criteria**:
  * Code coverage of the core rules engine is at least 90%.
  * File writing tests clean up after themselves, leaving the workspace tidy.

### TICKET-5.2: Create Examples & README.md
* **Description**: Create an `examples/` directory containing various project configurations (e.g., a small CLI tool, a high-scale SaaS web app). Write a comprehensive `README.md` in the root of the repository.
* **Acceptance Criteria**:
  * `README.md` details how to install, configure `dotstack-project.yaml`, run commands, and how to use outputs in developer/agent workflows.
  * English is used exclusively.
