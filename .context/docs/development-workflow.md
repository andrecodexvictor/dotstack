# Development Workflow - dotstack

This document guides developers and agents on how to compile, refactor, and extend the `dotstack` codebase.

---

## 1. Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 2. Compilation Guidelines
`dotstack` uses ESM modules (`"type": "module"`) and TypeScript:
- **Build Target**: Compiles TypeScript files from `src/` to `dist/` with declaration maps.
- **Build Command**:
  ```bash
  npm run build
  ```

---

## 3. ESM Module Resolution (CRITICAL)
Because `tsconfig.json` compiles under `NodeNext` resolution rules:
- **Rule**: When writing import statements for local files, you **must** use the `.js` file extension, even if the file on disk is `.ts`.
- **Correct**:
  ```typescript
  import { Rule } from '../rules/index.js';
  ```
- **Incorrect**:
  ```typescript
  import { Rule } from '../rules/index.ts';
  import { Rule } from '../rules/index';
  ```

---

## 4. Refactoring and Extending Rules
1. Create a new class under `src/core/rules/` that implements the `Rule` interface:
   ```typescript
   export interface Rule {
     name: string;
     description: string;
     evaluate(brief: ProjectBrief, registry: ScoringRegistry): void;
   }
   ```
2. Register the rule inside `src/core/services/recommendation.service.ts` by adding it to the `rules` array.
3. Compile (`npm run build`) and run unit tests (`npm run test`) to verify the rules mutate scores correctly.
