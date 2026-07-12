import { describe, it, expect } from 'vitest';
import { RecommendationService } from '../../src/core/services/recommendation.service.js';
import { ProjectBrief } from '../../src/core/models/brief.js';

describe('RecommendationService Rules Engine', () => {
  const service = new RecommendationService();

  it('should recommend Monolith and output warning risk for a small team (< 6 devs)', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'Simple API Project',
        type: 'API'
      },
      team: {
        devs: 2,
        experience: 'intermediate'
      },
      requirements: {
        scale: 'low',
        latency: 'normal',
        availability: 'normal'
      },
      constraints: {}
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.architectureStyle).toBe('Monolith');
    expect(rec.recommendation.frontend).toBe('None'); // API has no frontend
    expect(rec.risks).toContain('Microservices are discouraged for teams with only 2 developer(s) due to overhead.');
  });

  it('should recommend Rust (Axum) backend when latency is low-latency', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'High Performance System',
        type: 'SaaS'
      },
      team: {
        devs: 5,
        experience: 'senior'
      },
      requirements: {
        scale: 'high',
        latency: 'low-latency',
        availability: 'high-availability'
      },
      constraints: {}
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.backend).toBe('Rust (Axum)');
    expect(rec.recommendation.cache).toBe('Redis');
  });

  it('should respect database and cloud overrides in constraints', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'Custom SaaS',
        type: 'SaaS'
      },
      team: {
        devs: 3,
        experience: 'intermediate'
      },
      requirements: {
        scale: 'medium',
        latency: 'normal',
        availability: 'normal'
      },
      constraints: {
        database: 'MongoDB',
        cloud: 'AWS'
      }
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.database).toBe('MongoDB');
    expect(rec.recommendation.deployment).toBe('AWS');
  });

  it('should attach correct design patterns and repository examples for NestJS + PostgreSQL', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'Large SaaS App',
        type: 'SaaS'
      },
      team: {
        devs: 8,
        experience: 'senior'
      },
      requirements: {
        scale: 'high',
        latency: 'normal',
        availability: 'high-availability'
      },
      constraints: {
        language: 'TypeScript'
      }
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.backend).toBe('TypeScript (NestJS)');
    expect(rec.recommendation.database).toBe('PostgreSQL');

    const patternNames = rec.patterns.map(p => p.name);
    expect(patternNames).toContain('Clean Architecture (Hexagonal / Ports & Adapters)');
    expect(patternNames).toContain('Repository Pattern');
    expect(patternNames).toContain('CQRS (Command Query Responsibility Segregation)');
  });

  it('should recommend AI frameworks based on product profile (RAG vs Agents)', () => {
    const briefRAG: ProjectBrief = {
      product: {
        name: 'Smart Document Search AI',
        type: 'SaaS'
      },
      team: {
        devs: 3,
        experience: 'intermediate'
      },
      requirements: {
        scale: 'medium',
        latency: 'normal',
        availability: 'normal'
      },
      constraints: {}
    };

    const recRAG = service.recommend(briefRAG);
    expect(recRAG.recommendation.aiFramework).toBe('LlamaIndex');

    const briefAgent: ProjectBrief = {
      product: {
        name: 'Autonomous Sales Agent',
        type: 'SaaS'
      },
      team: {
        devs: 3,
        experience: 'intermediate'
      },
      requirements: {
        scale: 'medium',
        latency: 'normal',
        availability: 'normal'
      },
      constraints: {}
    };

    const recAgent = service.recommend(briefAgent);
    expect(recAgent.recommendation.aiFramework).toBe('LangGraph');
  });

  it('should apply compliance bonuses and recommend secure systems', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'HIPAA Compliant Health App',
        type: 'SaaS'
      },
      team: {
        devs: 6,
        experience: 'senior'
      },
      requirements: {
        scale: 'high',
        latency: 'normal',
        availability: 'high-availability'
      },
      constraints: {},
      compliance: ['hipaa'],
      security: {
        level: 'hardened',
        encryption: true,
        secretsManagement: true
      }
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.backend).toBe('Java (Spring Boot)');
    expect(rec.recommendation.observability).toBe('OpenTelemetry');
    expect(rec.recommendation.security).toBe('HashiCorp Vault');
    expect(rec.risks.some(r => r.includes('HIPAA'))).toBe(true);
  });

  it('should recommend Amazon Aurora and active-active setups under critical HA requirements', () => {
    const brief: ProjectBrief = {
      product: {
        name: 'Critical Finance App',
        type: 'SaaS'
      },
      team: {
        devs: 8,
        experience: 'senior'
      },
      requirements: {
        scale: 'high',
        latency: 'normal',
        availability: 'high-availability'
      },
      constraints: {
        cloud: 'AWS'
      },
      haRequirements: 'critical'
    };

    const rec = service.recommend(brief);

    expect(rec.recommendation.database).toBe('Amazon Aurora (PostgreSQL)');
    expect(rec.risks).toContain('CRITICAL HA requirements: Recommend cross-region database replication and active-active clustering.');
  });
});
