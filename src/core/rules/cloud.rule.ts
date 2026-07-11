import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class CloudRule implements Rule {
  name = 'Cloud and Deployment Rule';
  description = 'Decides deployment target based on team size, expected scale, budget, and technologies.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const devs = brief.team.devs;
    const scale = brief.requirements.scale;
    const budget = brief.constraints.budget;

    // Default base scores
    registry.deployment['Vercel'] += 20;
    registry.deployment['Render'] += 25;
    registry.deployment['AWS'] += 10;
    registry.deployment['Docker (Self-hosted)'] += 15;

    // Budget constraint checks
    if (budget !== undefined && budget < 30) {
      registry.deployment['Render'] += 40;
      registry.deployment['Vercel'] += 30;
      registry.deployment['AWS'] -= 100;
      registry.rationales.deployment = `Render/Vercel selected due to very low monthly budget constraint ($${budget} USD). AWS avoids high base costs.`;
      return;
    }

    if (scale === 'high') {
      if (devs >= 6) {
        registry.deployment['AWS'] += 60;
        registry.deployment['Docker (Self-hosted)'] += 20;
        registry.rationales.deployment = 'AWS recommended to support granular scaling, high availability, and container orchestration (ECS/EKS) managed by a larger team.';
      } else {
        registry.deployment['Docker (Self-hosted)'] += 40;
        registry.deployment['Render'] += 30;
        registry.rationales.deployment = 'Docker (Self-hosted) or Render recommended to support high scale while minimizing infrastructure operations complexity for a small team.';
      }
      return;
    }

    // Default for small/medium teams
    if (devs <= 3) {
      registry.deployment['Render'] += 40;
      registry.deployment['Vercel'] += 30;
      registry.rationales.deployment = 'Render selected for seamless PaaS hosting (database and backend web service) with minimal management overhead.';
    } else {
      registry.deployment['Docker (Self-hosted)'] += 40;
      registry.rationales.deployment = 'Docker (Self-hosted) selected to establish standard containerized environment across staging and production.';
    }
  }
}
