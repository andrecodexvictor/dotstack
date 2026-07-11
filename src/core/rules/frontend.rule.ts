import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class FrontendRule implements Rule {
  name = 'Frontend Framework Rule';
  description = 'Recommends frontend frameworks based on product type, team experience, and scale.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const type = brief.product.type;
    const experience = brief.team.experience;
    const scale = brief.requirements.scale;

    if (type === 'API' || type === 'CLI') {
      registry.frontend['None'] += 1000;
      registry.rationales.frontend = 'No frontend framework recommended because the product is an API or CLI.';
      return;
    }

    // Baseline scores
    registry.frontend['React'] += 30;
    registry.frontend['Next.js (React)'] += 20;
    registry.frontend['Vue'] += 20;
    registry.frontend['Svelte'] += 20;

    if (scale === 'high') {
      registry.frontend['Next.js (React)'] += 40; // favors production scale and SSR
      registry.frontend['React'] += 20;
      registry.rationales.frontend = 'Next.js (React) recommended for high scale web application to support SSR and SEO optimization.';
    } else if (experience === 'junior') {
      registry.frontend['Vue'] += 30;
      registry.frontend['Svelte'] += 30;
      registry.rationales.frontend = 'Vue or Svelte recommended due to lower complexity and junior developer friendly ecosystem.';
    } else {
      registry.frontend['React'] += 20;
      registry.rationales.frontend = 'React recommended as the industry standard for intermediate/senior developer productivity.';
    }
  }
}
