import { describe, it, expect } from 'vitest';
import { generateMarkdownReport, generateJSONReport } from '../../src/core/report/index.js';
import { StackRecommendation } from '../../src/core/models/recommendation.js';
import { ProjectBrief } from '../../src/core/models/brief.js';

describe('Report Generators', () => {
  const brief: ProjectBrief = {
    product: { name: 'Report Test App', type: 'SaaS' },
    team: { devs: 4, experience: 'intermediate' },
    requirements: { scale: 'medium', latency: 'normal', availability: 'normal' },
    constraints: {},
    compliance: ['gdpr'],
    multiTenant: true,
    realTime: true,
    haRequirements: 'high',
    security: { level: 'hardened', encryption: true, secretsManagement: true }
  };

  const rec: StackRecommendation = {
    metadata: { generatedAt: '2026-07-12T12:00:00Z', project: 'Report Test App' },
    recommendation: {
      architectureStyle: 'Modular Monolith',
      frontend: 'Next.js (React)',
      backend: 'TypeScript (NestJS)',
      database: 'Amazon Aurora (PostgreSQL)',
      cache: 'Redis',
      deployment: 'AWS',
      observability: 'OpenTelemetry',
      messaging: 'RabbitMQ',
      testing: 'Vitest',
      auth: 'Auth0',
      security: 'HashiCorp Vault',
      orchestration: 'AWS ECS/Fargate'
    },
    rationale: {
      architectureStyle: 'Selected based on scale.',
      frontend: 'Selected based on experience.',
      backend: 'Selected based on TypeScript preference.',
      database: 'Selected for transactional integrity.',
      cache: 'Redis selected for caching.',
      deployment: 'AWS selected for hosting.',
      observability: 'OpenTelemetry selected.',
      messaging: 'RabbitMQ selected.',
      testing: 'Vitest selected.',
      auth: 'Auth0 selected.',
      security: 'Vault selected.',
      orchestration: 'ECS selected.'
    },
    patterns: [
      { name: 'Clean Architecture', description: 'Concentric rings architecture.', examples: [] }
    ],
    risks: ['Warning: No auth layer configured.']
  };

  it('should generate well-structured markdown report', () => {
    const md = generateMarkdownReport(rec, brief, true);

    expect(md).toContain('# Architecture Decisions Report — Report Test App');
    expect(md).toContain('## 1. Executive Summary');
    expect(md).toContain('## 2. Core Recommendations');
    expect(md).toContain('## 3. Risks & Warnings Checklist');
    expect(md).toContain('## 4. Design Patterns & Reference Codebases');
    expect(md).toContain('## 5. Scoring Details');
    expect(md).toContain('Compliance Constraints**: GDPR');
    expect(md).toContain('Multi-Tenancy Required**: Yes');
    expect(md).toContain('Real-Time Required**: Yes');
    expect(md).toContain('HA Target Profile**: high');
    expect(md).toContain('Security Level**: hardened');
  });

  it('should generate well-structured JSON report', () => {
    const jsonStr = generateJSONReport(rec, brief, true);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.metadata.project).toBe('Report Test App');
    expect(parsed.stack.backend).toBe('TypeScript (NestJS)');
    expect(parsed.stack.database).toBe('Amazon Aurora (PostgreSQL)');
    expect(parsed.stack.observability).toBe('OpenTelemetry');
    expect(parsed.stack.messaging).toBe('RabbitMQ');
    expect(parsed.risks).toContain('Warning: No auth layer configured.');
    expect(parsed.patterns[0].name).toBe('Clean Architecture');
  });
});
