import { ProjectBrief, ProjectBriefSchema } from '../models/brief.js';
import { StackRecommendation, ScoringRegistry } from '../models/recommendation.js';
import { createInitialScores } from '../rules/index.js';
import { ArchitectureRule } from '../rules/architecture.rule.js';
import { FrontendRule } from '../rules/frontend.rule.js';
import { BackendRule } from '../rules/backend.rule.js';
import { DatabaseRule } from '../rules/database.rule.js';
import { CloudRule } from '../rules/cloud.rule.js';
import { AiRule } from '../rules/ai.rule.js';
import { ExpandedRule } from '../rules/expanded.rule.js';
import { getPatternsForStack } from '../registry/patterns.js';

export class RecommendationService {
  private rules = [
    new ArchitectureRule(),
    new FrontendRule(),
    new BackendRule(),
    new DatabaseRule(),
    new CloudRule(),
    new AiRule(),
    new ExpandedRule()
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
    let aiFramework = this.getWinner(registry.aiFramework);
    let deployment = this.getWinner(registry.deployment);
    const observability = this.getWinner(registry.observability);
    const messaging = this.getWinner(registry.messaging);
    const testing = this.getWinner(registry.testing);
    const auth = this.getWinner(registry.auth);
    const security = this.getWinner(registry.security);
    const orchestration = this.getWinner(registry.orchestration);
    const mobile = this.getWinner(registry.mobile);

    // 5. Apply User Constraints (Overrides)
    
    // Constraint: Language Override
    if (brief.constraints.language) {
      const lang = brief.constraints.language;
      let candidates: string[] = [];
      if (lang === 'C') {
        candidates = Object.keys(registry.backend).filter(key => key.startsWith('C ('));
      } else if (lang === 'C++') {
        candidates = Object.keys(registry.backend).filter(key => key.startsWith('C++'));
      } else if (lang === 'CSharp') {
        candidates = Object.keys(registry.backend).filter(key => key.startsWith('CSharp'));
      } else {
        candidates = Object.keys(registry.backend).filter(key => key.startsWith(lang));
      }

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
        else if (lang === 'C++') backend = 'C++ (Drogon)';
        else if (lang === 'C') backend = 'C (Native/CGI)';
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

    // Constraint: AI Framework Override
    if (brief.constraints.aiFramework) {
      const ai = brief.constraints.aiFramework;
      aiFramework = Object.keys(registry.aiFramework).find(key => key.toLowerCase().includes(ai.toLowerCase())) || ai;
      registry.rationales.aiFramework = `AI framework forced to ${aiFramework} due to constraint preference.`;
    }

    // 6. Match Patterns & Templates
    const patterns = getPatternsForStack(backend, database, archStyle, {
      hasMessaging: messaging !== 'None',
      hasKubernetes: orchestration.includes('Kubernetes'),
      isMobile: brief.product.type === 'MobileApp',
      isHardened: brief.security?.level === 'hardened',
      hasFrontend: frontend !== 'None',
      isAiSupported: !!brief.team.aiSupported || !!brief.team.onePersonBillionBusiness
    });

    // 7. Format Output & Post-Resolution Risk Flags
    if (observability === 'None') {
      registry.risks.push('No observability stack detected — HIGH RISK');
    }
    if (auth === 'None' && brief.product.type !== 'CLI' && brief.product.type !== 'InternalTool') {
      registry.risks.push('No auth/security layer — WARNING');
    }
    if (orchestration === 'Kubernetes (EKS/GKE/AKS)' && brief.team.devs <= 2 && !brief.team.aiSupported && !brief.team.onePersonBillionBusiness) {
      registry.risks.push('Over-engineering alert: K8s for a 2-person MVP');
    }

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
        aiFramework: aiFramework !== 'None' ? aiFramework : undefined,
        deployment: deployment,
        observability: observability !== 'None' ? observability : undefined,
        messaging: messaging !== 'None' ? messaging : undefined,
        testing: testing !== 'None' ? testing : undefined,
        auth: auth !== 'None' ? auth : undefined,
        security: security !== 'None' ? security : undefined,
        orchestration: orchestration !== 'None' ? orchestration : undefined,
        mobile: mobile !== 'None' ? mobile : undefined
      },
      rationale: {
        architectureStyle: registry.rationales.architectureStyle || 'Selected based on scale and team size.',
        frontend: registry.rationales.frontend || 'Selected based on user type and experience.',
        backend: registry.rationales.backend || 'Selected based on scale and language constraints.',
        database: registry.rationales.database || 'Selected based on integrity and storage requirements.',
        cache: cache !== 'None' ? registry.rationales.cache : undefined,
        aiFramework: aiFramework !== 'None' ? registry.rationales.aiFramework : undefined,
        deployment: registry.rationales.deployment || 'Selected based on team capability and target cloud.',
        observability: observability !== 'None' ? registry.rationales.observability || 'Observability solution selected based on infrastructure.' : undefined,
        messaging: messaging !== 'None' ? registry.rationales.messaging || 'Messaging queue selected based on scale and patterns.' : undefined,
        testing: testing !== 'None' ? registry.rationales.testing || 'Testing framework selected based on language and backend.' : undefined,
        auth: auth !== 'None' ? registry.rationales.auth || 'Auth provider selected based on scale and requirements.' : undefined,
        security: security !== 'None' ? registry.rationales.security || 'Security tools recommended to meet standard/hardened compliance.' : undefined,
        orchestration: orchestration !== 'None' ? registry.rationales.orchestration || 'Orchestration stack recommended for runtime environment.' : undefined,
        mobile: mobile !== 'None' ? registry.rationales.mobile || 'Mobile client framework recommended for the target product type.' : undefined
      },
      patterns: patterns,
      risks: registry.risks
    };
  }

  private getWinner(scores: Record<string, number>): string {
    return Object.keys(scores).reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  }
}
