import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class BackendRule implements Rule {
  name = 'Backend Framework Rule';
  description = 'Decides backend language and framework based on product scale, latency requirements, and team constraints.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const type = brief.product.type;
    const devs = brief.team.devs;
    const experience = brief.team.experience;
    const scale = brief.requirements.scale;
    const latency = brief.requirements.latency;

    // Default base scores
    registry.backend['TypeScript (Express)'] += 20;
    registry.backend['TypeScript (NestJS)'] += 20;
    registry.backend['Python (FastAPI)'] += 20;
    registry.backend['Python (Django)'] += 10;
    registry.backend['Go (Gin)'] += 15;
    registry.backend['Java (Spring Boot)'] += 10;

    // Latency & Scale
    if (latency === 'low-latency') {
      registry.backend['Go (Gin)'] += 50;
      registry.backend['TypeScript (Express)'] += 10;
      registry.rationales.backend = 'Go (Gin) recommended due to low-latency and high-performance concurrency requirements.';
      return;
    }

    if (scale === 'high') {
      if (devs >= 6) {
        registry.backend['TypeScript (NestJS)'] += 40;
        registry.backend['Java (Spring Boot)'] += 45;
        registry.rationales.backend = 'Java (Spring Boot) or NestJS recommended for high-scale enterprise applications with structured codebases.';
      } else {
        registry.backend['Go (Gin)'] += 35;
        registry.backend['TypeScript (NestJS)'] += 30;
        registry.rationales.backend = 'Go or NestJS recommended for high-scale applications managed by small teams.';
      }
      return;
    }

    // Junior or fast prototype focus
    if (experience === 'junior') {
      registry.backend['Python (FastAPI)'] += 40;
      registry.backend['TypeScript (Express)'] += 30;
      registry.rationales.backend = 'Python (FastAPI) recommended for ease of learning, automatic OpenAPI documentation, and rapid onboarding.';
      return;
    }

    // Standard fallback
    registry.backend['TypeScript (NestJS)'] += 30;
    registry.backend['TypeScript (Express)'] += 15;
    registry.rationales.backend = 'TypeScript (NestJS) recommended for maintainable modular architecture and typescript-first developer productivity.';
  }
}
