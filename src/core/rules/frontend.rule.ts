import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class FrontendRule implements Rule {
  name = 'Frontend Framework Rule';
  description = 'Recommends frontend frameworks (React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Angular, SolidJS, Astro) based on scale, experience, and product type.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const type = brief.product.type;
    const experience = brief.team.experience;
    const scale = brief.requirements.scale;

    if (type === 'API' || type === 'CLI') {
      registry.frontend['None'] += 1000;
      registry.rationales.frontend = 'No frontend framework recommended because the product is an API or CLI.';
      return;
    }

    // Baselines
    registry.frontend['React'] += 20;
    registry.frontend['Next.js (React)'] += 25;
    registry.frontend['Vue'] += 15;
    registry.frontend['Nuxt (Vue)'] += 15;
    registry.frontend['Svelte'] += 15;
    registry.frontend['SvelteKit'] += 20;
    registry.frontend['Angular'] += 10;
    registry.frontend['SolidJS'] += 15;
    registry.frontend['Astro'] += 15;

    // 1. Astro for low-scale static sites / content sites / Astro islands
    if (scale === 'low') {
      registry.frontend['Astro'] += 40;
      registry.frontend['Svelte'] += 20;
      registry.frontend['SolidJS'] += 25;
      registry.rationales.frontend = 'Astro recommended for low-scale applications to maximize performance via static site generation (SSG) and islands architecture.';
      return;
    }

    // 2. High scale production frameworks
    if (scale === 'high') {
      registry.frontend['Next.js (React)'] += 45;
      registry.frontend['SvelteKit'] += 35;
      registry.frontend['Nuxt (Vue)'] += 30;
      registry.frontend['Angular'] += 25;
      registry.rationales.frontend = 'Next.js (React) recommended for high-scale environments to leverage SSR, ISR, and extensive ecosystem support.';
      return;
    }

    // 3. Junior teams
    if (experience === 'junior') {
      registry.frontend['Vue'] += 35;
      registry.frontend['Svelte'] += 30;
      registry.frontend['Astro'] += 30;
      registry.rationales.frontend = 'Vue or Svelte recommended due to lower learning curve and simple boilerplate, speeding up delivery for junior teams.';
      return;
    }

    // 4. Default SaaS/WebApp intermediate
    registry.frontend['Next.js (React)'] += 20;
    registry.frontend['SvelteKit'] += 15;
    registry.rationales.frontend = 'Next.js (React) recommended as the standard framework for feature-rich web applications.';
  }
}
