# Contributing to dotstack

Thank you for your interest in contributing to **dotstack**! We welcome contributions from the community.

---

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Run the test suite**:
   ```bash
   npm run test
   ```

---

## How to Contribute

### Adding a New Backend Framework

1. Open `src/core/rules/index.ts` and add the new framework key with a score of `0` to the `backend` registry inside `createInitialScores()`.
2. Open `src/core/rules/backend.rule.ts` and add scoring logic for the new framework in the `evaluate()` method.
3. If the framework has specific design patterns, add them in `src/core/registry/patterns.ts`.
4. Write or update tests in `tests/core/recommendation.test.ts`.
5. Run `npm run build && npm run test` to verify.

### Adding a New Database

1. Add the key in `src/core/rules/index.ts` → `database` registry.
2. Add the Zod enum value in `src/core/models/brief.ts` → `DatabasePreferenceSchema`.
3. Add scoring logic in `src/core/rules/database.rule.ts`.
4. Verify with `npm run build && npm run test`.

### Adding a New Cloud / Deployment Target

1. Add the key in `src/core/rules/index.ts` → `deployment` registry.
2. Add the Zod enum value in `src/core/models/brief.ts` → `CloudPreferenceSchema`.
3. Add scoring logic in `src/core/rules/cloud.rule.ts`.
4. Verify with `npm run build && npm run test`.

### Adding a New AI/LLM Framework

1. Add the key in `src/core/rules/index.ts` → `aiFramework` registry.
2. Add the Zod enum value in `src/core/models/brief.ts` → `AiFrameworkPreferenceSchema`.
3. Add scoring logic in `src/core/rules/ai.rule.ts`.
4. Verify with `npm run build && npm run test`.

### Adding a New MCP Installer Target

1. Open `src/adapters/cli/mcp-installer.ts`.
2. Add a new block following the pattern of existing targets.
3. Update the `InstallTarget` union type at the top of the file.
4. Update the CLI help text in `src/adapters/cli/index.ts`.

---

## Code Conventions

- **ESM Module Resolution**: All local TypeScript imports **must** use `.js` extensions (e.g., `import { Foo } from './foo.js'`).
- **Ports & Adapters Architecture**: Business logic lives in `src/core/`. Infrastructure and I/O adapters live in `src/adapters/`.
- **No External AI API Calls**: The rules engine and search engine are 100% offline and deterministic. Do not add network dependencies to the core domain.

---

## Pull Request Guidelines

1. Create a feature branch from `master`.
2. Ensure `npm run build` and `npm run test` pass with zero failures.
3. Write clear commit messages following [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `chore:`).
4. Open a PR with a description of what changed and why.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
