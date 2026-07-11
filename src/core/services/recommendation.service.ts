import { ProjectBrief, ProjectBriefSchema } from '../models/brief.js';
import { StackRecommendation, ScoringRegistry } from '../models/recommendation.js';
import { createInitialScores } from '../rules/index.js';
import { ArchitectureRule } from '../rules/architecture.rule.js';
import { FrontendRule } from '../rules/frontend.rule.js';
import { BackendRule } from '../rules/backend.rule.js';
import { DatabaseRule } from '../rules/database.rule.js';
import { CloudRule } from '../rules/cloud.rule.js';
import { getPatternsForStack } from '../registry/patterns.js';

export class RecommendationService {
  private rules = [
    new ArchitectureRule(),
    new FrontendRule(),
    new BackendRule(),
    new DatabaseRule(),
    new CloudRule()
  ];

  public recommend(rawBrief: unknown): StackRecommendation {
    // 1. Validate Project Brief
    const brief = ProjectBriefSchema.parse(rawBrief);

    // 2. Initialize scores
    const registry = createInitialScores();

    // 3. Run all rules
    for (const rule of this.rules) {
      rule.evaluate(brief, registry);
    }

    // 4. Resolve Winners with Scoring
    const archStyle = this.getWinner(registry.architectureStyle);
    let frontend = this.getWinner(registry.frontend);
    let backend = this.getWinner(registry.backend);
    let database = this.getWinner(registry.database);
    const cache = this.getWinner(registry.cache);
    let deployment = this.getWinner(registry.deployment);

    // 5. Apply User Constraints (Overrides)
    
    // Constraint: Language Override
    if (brief.constraints.language) {
      const lang = brief.constraints.language;
      const candidates = Object.keys(registry.backend).filter(key => key.startsWith(lang));
      if (candidates.length > 0) {
        // Pick the highest scoring framework for this language
        backend = candidates.reduce((a, b) => 
          registry.backend[a] >= registry.backend[b] ? a : b
        );
        registry.rationales.backend = `Backend framework forced to ${backend} due to language constraint preference for ${lang}.`;
      } else {
        // Fallbacks
        if (lang === 'Go') backend = 'Go (Gin)';
        else if (lang === 'Java') backend = 'Java (Spring Boot)';
        registry.rationales.backend = `Backend framework forced to ${backend} due to language constraint preference for ${lang}.`;
      }
    }

    // Constraint: Database Override
    if (brief.constraints.database) {
      const db = brief.constraints.database;
      database = Object.keys(registry.database).find(key => key.toLowerCase().includes(db.toLowerCase())) || db;
      registry.rationales.database = `Database forced to ${database} due to constraint preference.`;
    }

    // Constraint: Cloud Override
    if (brief.constraints.cloud) {
      const cloud = brief.constraints.cloud;
      deployment = Object.keys(registry.deployment).find(key => key.toLowerCase().includes(cloud.toLowerCase())) || cloud;
      registry.rationales.deployment = `Cloud hosting target forced to ${deployment} due to constraint preference.`;
    }

    // 6. Match Patterns & Templates
    const patterns = getPatternsForStack(backend, database, archStyle);

    // 7. Format Output
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        project: brief.product.name
      },
      recommendation: {
        architectureStyle: archStyle,
        frontend: frontend,
        backend: backend,
        database: database,
        cache: cache !== 'None' ? cache : undefined,
        deployment: deployment
      },
      rationale: {
        architectureStyle: registry.rationales.architectureStyle || 'Selected based on scale and team size.',
        frontend: registry.rationales.frontend || 'Selected based on user type and experience.',
        backend: registry.rationales.backend || 'Selected based on scale and language constraints.',
        database: registry.rationales.database || 'Selected based on integrity and storage requirements.',
        cache: cache !== 'None' ? registry.rationales.cache : undefined,
        deployment: registry.rationales.deployment || 'Selected based on team capability and target cloud.'
      },
      patterns: patterns,
      risks: registry.risks
    };
  }

  private getWinner(scores: Record<string, number>): string {
    return Object.keys(scores).reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  }
}
