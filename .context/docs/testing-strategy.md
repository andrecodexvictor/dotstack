# Testing Strategy - dotstack

This document describes how automated tests are structured and verified.

---

## 1. Test Runner
We use **Vitest** for running unit and integration tests. It is fast, compatible with Jest assertions, and natively supports TypeScript and ESM.

- **Run all tests**:
  ```bash
  npm run test
  ```

---

## 2. Test Suites

### A. Rules Engine Tests (`tests/core/recommendation.test.ts`)
- Asserts that the core rules engine calculates correct stack scores.
- Verifies edge cases (e.g. small teams, high-scale latency requirements, constraints overrides).
- Completely offline, runs in-memory with zero network or filesystem side-effects.

### B. Semantic Search Tests (`tests/core/semantic-search.test.ts`)
- Asserts that TF-IDF index compilation and Cosine Similarity rank matching behave as expected.
- Asserts that queries with stop-words return empty results, and valid terms return correct, prioritized documents.

### C. Filesystem Adapter Integration Tests (`tests/adapters/node-fs.test.ts`)
- Verifies output directory routing.
- If `.context/` is present in the target directory, verifies it writes outputs to `.context/dotstack/`.
- If `.context/` is absent, verifies it creates and writes outputs to `.stack/`.
- **Cleanup Rule**: Filesystem tests write to a temporary folder `tests/tmp-fs-test/` and recursively delete it in the `afterEach` hook using:
  ```typescript
  await fs.rm(testRoot, { recursive: true, force: true });
  ```
