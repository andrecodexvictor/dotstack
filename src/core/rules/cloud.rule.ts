import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class CloudRule implements Rule {
  name = 'Cloud and Deployment Rule';
  description = 'Decides deployment target (Vercel, Render, AWS, GCP, Azure, Fly.io, Cloudflare Workers, Supabase, Docker) based on technology selection, scale, and budget.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const devs = brief.team.devs;
    const scale = brief.requirements.scale;
    const budget = brief.constraints.budget;
    const database = brief.constraints.database;

    // Baselines
    registry.deployment['Vercel'] += 20;
    registry.deployment['Render'] += 25;
    registry.deployment['AWS'] += 15;
    registry.deployment['GCP'] += 10;
    registry.deployment['Azure'] += 10;
    registry.deployment['Fly.io'] += 15;
    registry.deployment['Cloudflare Workers'] += 10;
    registry.deployment['Supabase'] += 15;
    registry.deployment['Docker (Self-hosted)'] += 15;

    // 1. Supabase integration
    if (database === 'DynamoDB' || database === 'Qdrant') {
      registry.deployment['AWS'] += 40;
    }

    // 2. Budget limits
    if (budget !== undefined && budget < 30) {
      registry.deployment['Render'] += 50;
      registry.deployment['Vercel'] += 40;
      registry.deployment['Cloudflare Workers'] += 35;
      registry.deployment['AWS'] -= 100;
      registry.deployment['GCP'] -= 100;
      registry.deployment['Azure'] -= 100;
      registry.rationales.deployment = `Render or Vercel recommended due to very low monthly budget constraint ($${budget} USD).`;
      return;
    }

    // 3. High Scale Enterprise
    if (scale === 'high') {
      if (devs >= 6) {
        registry.deployment['AWS'] += 55;
        registry.deployment['GCP'] += 40;
        registry.deployment['Azure'] += 40;
        registry.rationales.deployment = 'AWS recommended to support enterprise-grade orchestrations (ECS/EKS) and large-scale cloud operations.';
      } else {
        registry.deployment['Docker (Self-hosted)'] += 45;
        registry.deployment['Fly.io'] += 40;
        registry.rationales.deployment = 'Docker (Self-hosted) or Fly.io recommended to support scale while keeping operations lightweight for a small team.';
      }
      return;
    }

    // 4. Edge-centric runtime or serverless-focused MVP
    if (brief.product.type === 'WebApp' || brief.product.type === 'SaaS') {
      registry.deployment['Vercel'] += 30;
      registry.deployment['Cloudflare Workers'] += 25;
      registry.deployment['Render'] += 20;
      registry.rationales.deployment = 'Vercel or Render recommended for quick deployment pipelines and low server maintenance overhead.';
    } else {
      registry.deployment['Docker (Self-hosted)'] += 35;
      registry.rationales.deployment = 'Docker (Self-hosted) recommended to package applications into standard, portable container images.';
    }
  }
}
