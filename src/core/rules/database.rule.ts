import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class DatabaseRule implements Rule {
  name = 'Database and Caching Rule';
  description = 'Decides between SQLite, PostgreSQL, and MongoDB, and determines whether Redis is required.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const type = brief.product.type;
    const scale = brief.requirements.scale;
    const latency = brief.requirements.latency;

    // Database evaluation
    if (scale === 'low' || type === 'CLI') {
      registry.database['SQLite'] += 60;
      registry.database['PostgreSQL'] += 10;
      registry.rationales.database = 'SQLite recommended for low scale or CLI tools to avoid separate database server maintenance overhead.';
    } else {
      registry.database['PostgreSQL'] += 50;
      registry.database['MongoDB'] += 30;
      registry.rationales.database = 'PostgreSQL recommended for relational data consistency and strong indexing under medium/high load.';
    }

    // Cache evaluation
    if (scale === 'high' || latency === 'low-latency') {
      registry.cache['Redis'] += 60;
      registry.cache['None'] -= 20;
      registry.rationales.cache = 'Redis caching layer recommended to optimize performance under high load and meet latency budgets.';
    } else {
      registry.cache['None'] += 50;
      registry.cache['Redis'] += 10;
      registry.rationales.cache = 'No caching tier recommended to maintain a simple, low-cost architectural footprint.';
    }
  }
}
