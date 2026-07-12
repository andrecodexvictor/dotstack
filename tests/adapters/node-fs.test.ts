import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NodeFileSystemAdapter } from '../../src/adapters/fs/node-fs.adapter.js';
import { StackRecommendation } from '../../src/core/models/recommendation.js';
import fs from 'fs/promises';
import path from 'path';

describe('NodeFileSystemAdapter', () => {
  const adapter = new NodeFileSystemAdapter();
  const testRoot = path.resolve('tests/tmp-fs-test');

  const mockRecommendation: StackRecommendation = {
    metadata: {
      generatedAt: new Date().toISOString(),
      project: 'Test Project'
    },
    recommendation: {
      architectureStyle: 'Monolith',
      frontend: 'React',
      backend: 'TypeScript (Express)',
      database: 'SQLite',
      deployment: 'Render'
    },
    rationale: {
      architectureStyle: 'Test Rationale',
      frontend: 'Test Rationale',
      backend: 'Test Rationale',
      database: 'Test Rationale',
      deployment: 'Test Rationale'
    },
    patterns: [],
    risks: []
  };

  beforeEach(async () => {
    // Ensure clean state
    await fs.rm(testRoot, { recursive: true, force: true });
    await fs.mkdir(testRoot, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup
    await fs.rm(testRoot, { recursive: true, force: true });
  });

  it('should write outputs to .stack/ folder when .context/ is not present', async () => {
    const { yamlPath, mdPath } = await adapter.writeOutputs(mockRecommendation, testRoot);

    expect(yamlPath).toBe(path.join(testRoot, '.stack', 'stack.yaml'));
    expect(mdPath).toBe(path.join(testRoot, '.stack', 'README.md'));

    // Check files exist and are not empty
    const yamlStats = await fs.stat(yamlPath);
    expect(yamlStats.isFile()).toBe(true);
    expect(yamlStats.size).toBeGreaterThan(0);

    const mdStats = await fs.stat(mdPath);
    expect(mdStats.isFile()).toBe(true);
    expect(mdStats.size).toBeGreaterThan(0);
  });

  it('should write outputs to both .stack/ and .context/dotstack/ folder when .context/ is present', async () => {
    const contextDir = path.join(testRoot, '.context');
    await fs.mkdir(contextDir, { recursive: true });

    const { yamlPath, mdPath } = await adapter.writeOutputs(mockRecommendation, testRoot);

    expect(yamlPath).toBe(path.join(testRoot, '.stack', 'stack.yaml'));
    expect(mdPath).toBe(path.join(testRoot, '.stack', 'README.md'));

    // Check files exist in .stack
    const yamlStats = await fs.stat(yamlPath);
    expect(yamlStats.isFile()).toBe(true);

    const mdStats = await fs.stat(mdPath);
    expect(mdStats.isFile()).toBe(true);

    // Also check files exist in .context/dotstack
    const contextYaml = await fs.stat(path.join(testRoot, '.context', 'dotstack', 'stack.yaml'));
    const contextMd = await fs.stat(path.join(testRoot, '.context', 'dotstack', 'README.md'));
    expect(contextYaml.isFile()).toBe(true);
    expect(contextMd.isFile()).toBe(true);
  });
});
