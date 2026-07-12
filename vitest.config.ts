import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/core/**/*.ts'],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 60 // Some complex rule branching defaults
      }
    }
  }
});
