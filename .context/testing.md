# Codebase Testing Guidelines

`dotstack` utilizes **Vitest** for running automated unit and integration tests. Vitest was chosen for its native ESM support, speed, and compatible Jest assertions syntax.

---

## Command Reference

- **Run all tests**:
  ```bash
  npm run test
  ```

---

## Test Directory Structure

- `tests/core/`:
  - Contains unit tests for the rules engine scoring algorithms.
  - Tests verify that deterministic briefs (like small team size, high-scale parameters, latency constraints) evaluate to expected tech stack recommendations.
  - Verification:
    - `tests/core/recommendation.test.ts`
- `tests/adapters/`:
  - Contains I/O and filesystem integration tests.
  - Tests verify that `NodeFileSystemAdapter` writes configuration files correctly, parses briefs, and executes path routing (writing under `.context/dotstack/` when `.context/` is present, or `.stack/` when standalone).
  - Verification:
    - `tests/adapters/node-fs.test.ts`

---

## Guidelines for Writing Tests

1. **Deterministic Tests**:
   - Rules engine tests must be 100% deterministic and require no network requests or external resources.
2. **FS Cleanup**:
   - Filesystem adapter integration tests must use temporary directories (e.g., `tests/tmp-fs-test`) and recursively clean them up in `afterEach` hooks using `fs.rm` with `{ recursive: true, force: true }`.
3. **No Mocking of Simple Logic**:
   - Since the core services are written in pure TypeScript without Node dependencies, you do not need complex mock frameworks to test `RecommendationService`. Simply pass a plain object matching `ProjectBrief` to `service.recommend()`.
