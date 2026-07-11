# dotstack - Codebase Context

This directory contains architectural and design context for AI coding agents (`antigravity`, `claudecode`, `cursor`, `copilot`, `pidev`, etc.) working on this repository.

---

## Codebase Overview

`dotstack` is a deterministic, rule-based technology stack recommendation engine. It takes a project configuration (`dotstack-project.yaml`), runs heuristic scoring rules, and generates:
1. A structured stack specification (`stack.yaml`) for tools and agents.
2. A developer-friendly guide (`README.md`) explaining the selections.

---

## Architectural Paradigm: Hexagonal (Ports & Adapters)

To ensure compile-time isolation and maximize testability/reusability, the project enforces a strict separation:

- **Core Domain (`src/core/`)**:
  - Contains pure TypeScript logic.
  - **No Node.js runtime imports** (like `fs`, `path`, `process`).
  - Contains validation models, the rules scoring pipeline, the design pattern registry, and port interfaces.
- **Adapters (`src/adapters/`)**:
  - Implements ports utilizing environmental packages (Node.js file system, Commander CLI, picocolors).
- **SDK Library (`src/index.ts`)**:
  - Exposes programmatic APIs (`RecommendationService`) so other tools or MCP servers can embed `dotstack` without executing CLI subprocesses.

---

## File Registry & Maps

- **`src/core/models/brief.ts`**: The Zod schema defining the project parameter inputs (`dotstack-project.yaml`). Includes preprocessors to handle empty/null YAML fields safely.
- **`src/core/rules/`**: Individual scoring heuristics. Each rule mutates numeric weights in a central scoring registry.
- **`src/core/registry/patterns.ts`**: Built-in static catalog linking stack combinations with RefactoringGuru and curated GitHub template repositories.
- **`src/core/services/recommendation.service.ts`**: Pipeline orchestrator applying rules and constraint overrides.
- **`src/adapters/cli/index.ts`**: Commander CLI interface containing standard options, result formatting tables, and exit codes.
- **`src/adapters/fs/node-fs.adapter.ts`**: Directory detector mapping outputs to `.context/dotstack/` (if integrated) or `.stack/` (if standalone).

---

## Development Guide for Agents

- **Modifying Rules**: To alter stack recommendations, add or modify rules under `src/core/rules/`. Register new rule classes inside the `RecommendationService` constructor.
- **ESM Extensions**: You must append `.js` to all local TypeScript imports (e.g., `import { MyService } from './my-service.js'`).
- **Tests**: Write Vitest tests inside `tests/` before completing features. Run `npm run test` and `npm run build` to confirm correctness.
