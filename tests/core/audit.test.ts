import { describe, it, expect } from 'vitest';
import { AuditEngine } from '../../src/core/audit/index.js';
import { StackRecommendation } from '../../src/core/models/recommendation.js';
import fs from 'fs/promises';
import path from 'path';

describe('AuditEngine Heuristics Scan', () => {
  const auditEngine = new AuditEngine();

  const mockRec: StackRecommendation = {
    metadata: { generatedAt: '', project: 'mock' },
    recommendation: {
      architectureStyle: 'Monolith',
      frontend: 'Next.js (React)',
      backend: 'TypeScript (NestJS)',
      database: 'PostgreSQL',
      cache: 'Redis',
      observability: 'OpenTelemetry',
      messaging: 'Kafka',
      testing: 'Vitest',
      auth: 'Clerk',
      deployment: 'AWS'
    },
    rationale: {
      architectureStyle: '',
      frontend: '',
      backend: '',
      database: '',
      cache: '',
      observability: '',
      messaging: '',
      testing: '',
      auth: '',
      deployment: ''
    },
    patterns: [],
    risks: []
  };

  it('should scan mock project directory dependencies and match tech stack', async () => {
    // Create a temporary mock project directory inside workspace
    const tempDir = path.resolve('./temp-mock-project');
    await fs.mkdir(tempDir, { recursive: true });

    // Write a mock package.json
    const packageJson = {
      dependencies: {
        next: '^13.0.0',
        '@nestjs/core': '^9.0.0',
        pg: '^8.8.0',
        redis: '^4.5.0',
        kafkajs: '^2.2.0',
        vitest: '^1.0.0',
        '@clerk/nextjs': '^4.0.0',
        '@opentelemetry/api': '^1.3.0'
      }
    };
    await fs.writeFile(path.join(tempDir, 'package.json'), JSON.stringify(packageJson), 'utf8');

    // Run audit
    const res = await auditEngine.audit(tempDir, mockRec);

    expect(res.detected.frontend).toBe('Next.js (React)');
    expect(res.detected.backend).toBe('TypeScript (NestJS)');
    expect(res.detected.database).toBe('PostgreSQL');
    expect(res.detected.cache).toBe('Redis');
    expect(res.detected.messaging).toBe('Kafka');
    expect(res.detected.observability).toBe('OpenTelemetry');
    expect(res.detected.testing).toBe('Vitest');
    expect(res.detected.auth).toBe('Clerk');
    expect(res.alignmentScore).toBe(100);
    expect(res.divergences).toHaveLength(0);

    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should flag divergences when actual stack differs from recommendation', async () => {
    const tempDir = path.resolve('./temp-diverge-project');
    await fs.mkdir(tempDir, { recursive: true });

    // Write a package.json containing express instead of nestjs and sqlite instead of postgres
    const packageJson = {
      dependencies: {
        express: '^4.18.0',
        sqlite3: '^5.1.0'
      }
    };
    await fs.writeFile(path.join(tempDir, 'package.json'), JSON.stringify(packageJson), 'utf8');

    const res = await auditEngine.audit(tempDir, mockRec);

    expect(res.detected.backend).toBe('TypeScript (Express)');
    expect(res.detected.database).toBe('SQLite');
    expect(res.alignmentScore).toBeLessThan(100);
    expect(res.divergences.length).toBeGreaterThan(0);

    // Verify correct divergence entries
    const backendDiverge = res.divergences.find(d => d.category === 'Backend');
    const dbDiverge = res.divergences.find(d => d.category === 'Database');

    expect(backendDiverge?.recommended).toBe('TypeScript (NestJS)');
    expect(backendDiverge?.actual).toBe('TypeScript (Express)');
    expect(dbDiverge?.recommended).toBe('PostgreSQL');
    expect(dbDiverge?.actual).toBe('SQLite');

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});
