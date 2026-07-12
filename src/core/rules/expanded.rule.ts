import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class ExpandedRule implements Rule {
  name = 'Expanded Technology Catalog and Security/Compliance Rules';
  description = 'Scores messaging, observability, testing, auth, security, orchestration, and mobile options, plus applies compliance, real-time, multi-tenant, and HA bonuses.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const name = brief.product.name.toLowerCase();
    const type = brief.product.type;
    const subtype = brief.productSubtype;
    const devs = brief.team.devs;
    const experience = brief.team.experience;
    const scale = brief.requirements.scale;
    const latency = brief.requirements.latency;
    
    const cloud = brief.constraints.cloud;
    const lang = brief.constraints.language;
    const dbPref = brief.constraints.database;
    const budget = brief.constraints.budget || 100000; // default large budget if not specified

    // Read new fields safely with defaults
    const compliance = brief.compliance || [];
    const dataResidency = brief.dataResidency;
    const multiTenant = !!brief.multiTenant;
    const realTime = !!brief.realTime;
    const ha = brief.haRequirements || 'none';
    const securityLevel = brief.security?.level || 'standard';
    const encryptionRequired = !!brief.security?.encryption;
    const secretsMgmtRequired = !!brief.security?.secretsManagement;

    // ==========================================
    // 1. OBSERVABILITY SCORING
    // ==========================================
    if (scale === 'low' && budget < 50) {
      registry.observability['None'] += 50;
      registry.observability['Sentry'] += 15;
      registry.rationales.observability = 'Minimal observability (Sentry) recommended for tracking runtime errors within a low budget.';
    } else {
      registry.observability['Sentry'] += 35; // Good for app crash logging
      registry.observability['OpenTelemetry'] += 30;

      if (scale === 'high' || ha === 'high' || ha === 'critical') {
        registry.observability['OpenTelemetry'] += 30;
        registry.observability['Prometheus'] += 25;
        registry.observability['Grafana'] += 25;
        registry.observability['Loki'] += 20;
        registry.observability['Jaeger'] += 15;
        registry.rationales.observability = 'OpenTelemetry + Prometheus/Grafana stack recommended for cloud-native metrics, tracing, and distributed logs.';
      } else {
        registry.observability['Datadog'] += 20;
        registry.observability['New Relic'] += 15;
        registry.rationales.observability = 'Sentry and OpenTelemetry recommended for baseline tracing, error aggregation, and performance metrics.';
      }

      if (cloud === 'AWS') {
        registry.observability['AWS CloudWatch'] += 30;
      }
    }

    // ==========================================
    // 2. MESSAGING SCORING
    // ==========================================
    if (realTime || scale === 'high') {
      if (scale === 'high') {
        registry.messaging['Kafka'] += 60;
        registry.messaging['RabbitMQ'] += 40;
        registry.messaging['AWS SQS'] += 30;
        registry.rationales.messaging = 'Apache Kafka recommended to handle high-throughput event streaming and event-driven architecture.';
      } else {
        registry.messaging['RabbitMQ'] += 50;
        registry.messaging['Redis Streams'] += 45;
        registry.messaging['AWS SQS'] += 35;
        registry.rationales.messaging = 'RabbitMQ recommended for reliable message brokering, retries, and transactional messaging workflows.';
      }
    } else if (scale === 'medium') {
      registry.messaging['AWS SQS'] += 40;
      registry.messaging['RabbitMQ'] += 30;
      registry.messaging['EventBridge'] += 25;
      registry.rationales.messaging = 'AWS SQS recommended as a simple, serverless queue to decouple background worker tasks.';
    } else {
      registry.messaging['None'] += 50;
      registry.rationales.messaging = 'No message queue recommended to keep architecture footprints simple and overhead minimal.';
    }

    if (cloud === 'AWS' && registry.messaging['AWS SQS'] > 0) {
      registry.messaging['AWS SQS'] += 20;
    }

    // ==========================================
    // 3. TESTING SCORING
    // ==========================================
    // Vitest/Jest for JS/TS, Pytest for Python, JUnit for Java
    const isJS = lang === 'TypeScript' || type === 'WebApp' || type === 'SaaS';
    if (isJS) {
      registry.testing['Vitest'] += 50;
      registry.testing['Jest'] += 35;
      registry.testing['Playwright'] += 30;
      registry.rationales.testing = 'Vitest recommended for fast unit/integration tests, paired with Playwright for end-to-end user flows.';
    } else if (lang === 'Python') {
      registry.testing['Pytest'] += 60;
      registry.testing['Locust'] += 25;
      registry.rationales.testing = 'Pytest recommended as the testing framework of choice for Python apps.';
    } else if (lang === 'Java' || lang === 'Kotlin') {
      registry.testing['JUnit'] += 60;
      registry.rationales.testing = 'JUnit recommended for JVM-based application architectures.';
    } else {
      registry.testing['Vitest'] += 30;
      registry.rationales.testing = 'Standard unit testing runner recommended alongside Playwright.';
    }

    if (scale === 'high' || latency === 'low-latency') {
      registry.testing['k6'] += 40;
      registry.testing['Locust'] += 30;
    }

    // ==========================================
    // 4. AUTH SCORING
    // ==========================================
    if (type === 'CLI' || type === 'InternalTool') {
      registry.auth['None'] += 50;
      registry.rationales.auth = 'No centralized authentication layer recommended for CLI tools or basic internal utility scopes.';
    } else {
      if (cloud === 'Supabase') {
        registry.auth['Supabase Auth'] += 80;
        registry.rationales.auth = 'Supabase Auth recommended for native integration with Supabase database and hosting.';
      } else if (subtype === 'saas' || type === 'SaaS') {
        registry.auth['Clerk'] += 55;
        registry.auth['Auth0'] += 45;
        registry.auth['NextAuth.js'] += 35;
        registry.rationales.auth = 'Clerk recommended as a developer-friendly IDaaS provider for fast-growing SaaS customer auth.';
      } else if (multiTenant || scale === 'high') {
        registry.auth['Auth0'] += 60;
        registry.auth['Keycloak'] += 50;
        registry.rationales.auth = 'Auth0 or Keycloak recommended to manage complex multi-tenant client scopes and enterprise SSO.';
      } else {
        registry.auth['NextAuth.js'] += 40;
        registry.auth['Auth0'] += 30;
        registry.rationales.auth = 'NextAuth.js recommended for simple frontend-driven authentication sessions.';
      }

      if (cloud === 'AWS') {
        registry.auth['AWS Cognito'] += 30;
      }
    }

    // ==========================================
    // 5. SECURITY SCORING
    // ==========================================
    registry.security['Dependabot'] += 30;
    
    if (securityLevel === 'hardened' || compliance.length > 0) {
      registry.security['Semgrep'] += 40;
      registry.security['Trivy'] += 40;
      registry.security['Snyk'] += 35;
      
      if (secretsMgmtRequired || encryptionRequired) {
        registry.security['HashiCorp Vault'] += 50;
      }
      
      if (cloud === 'AWS') {
        registry.security['AWS KMS'] += 45;
        registry.security['AWS WAF'] += 45;
      }
      registry.rationales.security = 'Hardened security profile recommended: Semgrep (SAST), Trivy (container scan), and KMS/Vault for key management.';
    } else {
      registry.security['None'] += 40;
      registry.security['Semgrep'] += 20;
      registry.rationales.security = 'Standard Git-integrated security scanners (Dependabot, Semgrep) recommended for repository protection.';
    }

    // ==========================================
    // 6. ORCHESTRATION SCORING
    // ==========================================
    if (scale === 'high' && devs >= 6) {
      registry.orchestration['Kubernetes (EKS/GKE/AKS)'] += 70;
      registry.orchestration['AWS ECS/Fargate'] += 45;
      registry.rationales.orchestration = 'Kubernetes recommended for high scalability, service discovery, and zero-downtime rolling deploys.';
    } else if (scale === 'medium' || devs >= 3) {
      registry.orchestration['AWS ECS/Fargate'] += 50;
      registry.orchestration['Cloud Run'] += 45;
      registry.orchestration['Docker Compose'] += 30;
      registry.rationales.orchestration = 'AWS ECS/Fargate or Cloud Run container runner recommended to keep deployment operations manageable.';
    } else {
      registry.orchestration['Docker Compose'] += 60;
      registry.orchestration['None'] += 30;
      registry.rationales.orchestration = 'Docker Compose recommended to orchestrate local development and simple VM hosting layouts.';
    }

    // ==========================================
    // 7. MOBILE SCORING
    // ==========================================
    if (type === 'MobileApp') {
      if (lang === 'TypeScript') {
        registry.mobile['React Native'] += 65;
        registry.mobile['Expo'] += 55;
        registry.rationales.mobile = 'React Native + Expo recommended to build cross-platform mobile apps using a TypeScript codebase.';
      } else {
        registry.mobile['Flutter'] += 60;
        registry.rationales.mobile = 'Flutter cross-platform client recommended for high performance mobile rendering.';
      }
    } else {
      registry.mobile['None'] += 100;
    }

    // ==========================================
    // 8. SCORING BONUSES & COUPLING RULES
    // ==========================================
    
    // Compliance requirements bonuses (+15 to enterprise-ready solutions)
    if (compliance.length > 0) {
      // Spring Boot, Django, ASP.NET are highly compliant
      registry.backend['Java (Spring Boot)'] += 15 * compliance.length;
      registry.backend['Python (Django)'] += 15 * compliance.length;
      registry.backend['CSharp (ASP.NET Core)'] += 15 * compliance.length;
      
      // AWS, Azure, GCP are PCI/HIPAA certified
      registry.deployment['AWS'] += 15 * compliance.length;
      registry.deployment['GCP'] += 15 * compliance.length;
      registry.deployment['Azure'] += 15 * compliance.length;

      // SQLite is not suitable for compliant databases
      registry.database['SQLite'] -= 40;

      // Add a risk flag
      registry.risks.push(`Project requires ${compliance.join(', ').toUpperCase()} compliance. Ensure storage encryption is turned on.`);
    }

    // Multi-tenant bonuses (+10)
    if (multiTenant) {
      registry.database['PostgreSQL'] += 15;
      registry.database['Amazon Aurora (PostgreSQL)'] += 20;
      registry.database['DynamoDB'] += 15;
      registry.backend['TypeScript (NestJS)'] += 10;
      registry.backend['Java (Spring Boot)'] += 10;
    }

    // Real-time bonuses (+10)
    if (realTime) {
      registry.backend['Elixir (Phoenix)'] += 35;
      registry.backend['TypeScript (Hono)'] += 15;
      registry.backend['TypeScript (Fastify)'] += 15;
      registry.database['PostgreSQL'] += 10;
      registry.database['Redis'] += 20;
      
      if (registry.messaging['RabbitMQ'] > 0) {
        registry.messaging['RabbitMQ'] += 15;
      }
    }

    // HA / DR requirements
    if (ha === 'high' || ha === 'critical') {
      registry.database['Amazon Aurora (PostgreSQL)'] += 35;
      registry.database['Amazon Aurora (MySQL)'] += 30;
      registry.database['Google Cloud Spanner'] += 35;
      registry.database['CockroachDB'] += 35;
      registry.database['DynamoDB'] += 25;
      
      if (cloud === 'AWS') {
        registry.database['Amazon Aurora (PostgreSQL)'] += 40;
        registry.database['Amazon Aurora (MySQL)'] += 30;
        registry.database['AWS RDS (PostgreSQL)'] += 20;
      }
      
      registry.deployment['AWS'] += 20;
      registry.deployment['GCP'] += 20;
      registry.deployment['Azure'] += 20;

      registry.database['SQLite'] -= 50; // SQLite does not offer multi-node HA

      if (ha === 'critical') {
        registry.risks.push('CRITICAL HA requirements: Recommend cross-region database replication and active-active clustering.');
      }
    }

    // Security Hardening
    if (securityLevel === 'hardened') {
      registry.backend['Java (Spring Boot)'] += 15;
      registry.backend['Python (Django)'] += 15;
      registry.backend['CSharp (ASP.NET Core)'] += 15;
      registry.database['SQLite'] -= 30;
      
      if (cloud === 'AWS') {
        registry.database['Amazon Aurora (PostgreSQL)'] += 10;
        registry.database['AWS RDS (PostgreSQL)'] += 10;
      }
    }
  }
}
