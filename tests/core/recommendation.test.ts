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

  it('should correctly resolve C, C++, and CSharp overrides without collisions', () => {
    // C++
    const briefCpp: ProjectBrief = {
      product: { name: 'Fast CPP App', type: 'API' },
      team: { devs: 1, experience: 'senior' },
      requirements: { scale: 'high', latency: 'low-latency', availability: 'normal' },
      constraints: { language: 'C++' }
    };
    const recCpp = service.recommend(briefCpp);
    expect(recCpp.recommendation.backend).toBe('C++ (Drogon)');
    expect(recCpp.patterns.map(p => p.name)).toContain('RAII & Systems Memory Management');

    // C
    const briefC: ProjectBrief = {
      product: { name: 'Native C App', type: 'API' },
      team: { devs: 1, experience: 'senior' },
      requirements: { scale: 'low', latency: 'normal', availability: 'normal' },
      constraints: { language: 'C' }
    };
    const recC = service.recommend(briefC);
    expect(recC.recommendation.backend).toBe('C (Native/CGI)');
    expect(recC.patterns.map(p => p.name)).toContain('RAII & Systems Memory Management');

    // C#
    const briefCSharp: ProjectBrief = {
      product: { name: 'Enterprise C# App', type: 'API' },
      team: { devs: 5, experience: 'senior' },
      requirements: { scale: 'high', latency: 'normal', availability: 'normal' },
      constraints: { language: 'CSharp' }
    };
    const recCSharp = service.recommend(briefCSharp);
    expect(recCSharp.recommendation.backend).toBe('CSharp (ASP.NET Core)');
  });

  it('should recommend distributed architectures without over-engineering alerts for solo devs if AI supported', () => {
    const brief: ProjectBrief = {
      product: { name: 'Million User AI Startup', type: 'SaaS' },
      team: {
        devs: 1,
        experience: 'senior',
        aiSupported: true,
        onePersonBillionBusiness: true
      },
      requirements: { scale: 'high', latency: 'normal', availability: 'normal' },
      constraints: {}
    };

    const rec = service.recommend(brief);
    
    // Since it has AI support, it should support high scale distributed architecture scoring (like Modular Monolith or Microservices)
    // without microservices penalty or over-engineering alerts.
    expect(rec.recommendation.architectureStyle).not.toBe('Monolith');
    expect(rec.risks.some(r => r.includes('discouraged'))).toBe(false);
  });

  it('should attach UI/UX design tokens, progressive disclosure ergonomics, and Custom Hooks Architecture patterns for frontend apps', () => {
    const brief: ProjectBrief = {
      product: { name: 'Web App Portal', type: 'WebApp' },
      team: { devs: 2, experience: 'senior' },
      requirements: { scale: 'medium', latency: 'normal', availability: 'normal' },
      constraints: {}
    };

    const rec = service.recommend(brief);
    
    expect(rec.recommendation.frontend).not.toBe('None');
    const patternNames = rec.patterns.map(p => p.name);
    expect(patternNames).toContain('Design Tokens & Theme Consistency');
    expect(patternNames).toContain('Cognitive Load Minimization & UX Ergonomics');
    expect(patternNames).toContain('Custom Hooks Architecture (State & Effect Decoupling)');
  });
});
