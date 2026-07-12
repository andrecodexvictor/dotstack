import fs from 'fs/promises';
import path from 'path';
import { StackRecommendation } from '../models/recommendation.js';

export interface AuditResult {
  detected: {
    frontend?: string;
    backend?: string;
    database?: string;
    cache?: string;
    aiFramework?: string;
    deployment?: string;
    observability?: string;
    messaging?: string;
    testing?: string;
    auth?: string;
    security?: string;
    orchestration?: string;
    mobile?: string;
  };
  divergences: {
    category: string;
    recommended: string;
    actual: string;
    severity: 'low' | 'medium' | 'high';
    details: string;
  }[];
  alignmentScore: number; // 0 - 100
}

export class AuditEngine {
  public async audit(
    directory: string,
    recommendation: StackRecommendation
  ): Promise<AuditResult> {
    const detected: AuditResult['detected'] = {};
    const absoluteRoot = path.resolve(directory);

    // Helper to check file existence
    const fileExists = async (relPath: string) => {
      try {
        await fs.access(path.join(absoluteRoot, relPath));
        return true;
      } catch {
        return false;
      }
    };

    // Helper to read file content safely
    const readFileSafe = async (relPath: string) => {
      try {
        return await fs.readFile(path.join(absoluteRoot, relPath), 'utf8');
      } catch {
        return '';
      }
    };

    // 1. Scan package.json for JS/TS dependencies
    if (await fileExists('package.json')) {
      const packageJsonStr = await readFileSafe('package.json');
      const pkg = JSON.parse(packageJsonStr || '{}');
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      // Backend detection
      if (deps['express']) detected.backend = 'TypeScript (Express)';
      else if (deps['@nestjs/core']) detected.backend = 'TypeScript (NestJS)';
      else if (deps['fastify']) detected.backend = 'TypeScript (Fastify)';
      else if (deps['hono']) detected.backend = 'TypeScript (Hono)';

      // Frontend detection
      if (deps['next']) detected.frontend = 'Next.js (React)';
      else if (deps['nuxt']) detected.frontend = 'Nuxt (Vue)';
      else if (deps['@sveltejs/kit']) detected.frontend = 'SvelteKit';
      else if (deps['@angular/core']) detected.frontend = 'Angular';
      else if (deps['solid-js']) detected.frontend = 'SolidJS';
      else if (deps['astro']) detected.frontend = 'Astro';
      else if (deps['@remix-run/react']) detected.frontend = 'Remix';
      else if (deps['react']) detected.frontend = 'React';
      else if (deps['vue']) detected.frontend = 'Vue';
      else if (deps['svelte']) detected.frontend = 'Svelte';

      // Database detection
      if (deps['pg'] || deps['pg-promise'] || deps['postgres']) detected.database = 'PostgreSQL';
      else if (deps['mongodb'] || deps['mongoose']) detected.database = 'MongoDB';
      else if (deps['sqlite3'] || deps['better-sqlite3']) detected.database = 'SQLite';
      else if (deps['mysql'] || deps['mysql2']) detected.database = 'MySQL';
      else if (deps['cassandra-driver']) detected.database = 'Cassandra';
      else if (deps['neo4j-driver']) detected.database = 'Neo4j';
      else if (deps['@qdrant/js-client-rest']) detected.database = 'Qdrant';
      else if (deps['@aws-sdk/client-dynamodb']) detected.database = 'DynamoDB';

      // Caching detection
      if (deps['redis'] || deps['ioredis']) detected.cache = 'Redis';
      else if (deps['memcached']) detected.cache = 'Memcached';

      // AI Framework
      if (deps['langchain'] || deps['@langchain/core']) detected.aiFramework = 'LangChain';
      else if (deps['langgraph'] || deps['@langchain/langgraph']) detected.aiFramework = 'LangGraph';

      // Observability
      if (deps['@opentelemetry/api']) detected.observability = 'OpenTelemetry';
      else if (deps['@sentry/node'] || deps['@sentry/react']) detected.observability = 'Sentry';

      // Messaging
      if (deps['kafkajs']) detected.messaging = 'Kafka';
      else if (deps['amqplib']) detected.messaging = 'RabbitMQ';
      else if (deps['nats']) detected.messaging = 'NATS';

      // Testing
      if (deps['vitest']) detected.testing = 'Vitest';
      else if (deps['jest']) detected.testing = 'Jest';
      else if (deps['playwright'] || deps['@playwright/test']) detected.testing = 'Playwright';
      else if (deps['cypress']) detected.testing = 'Cypress';

      // Auth
      if (deps['@clerk/nextjs'] || deps['@clerk/clerk-sdk-node']) detected.auth = 'Clerk';
      else if (deps['@auth0/nextjs-auth0'] || deps['auth0']) detected.auth = 'Auth0';
      else if (deps['next-auth']) detected.auth = 'NextAuth.js';
      else if (deps['@supabase/auth-helpers-nextjs']) detected.auth = 'Supabase Auth';
    }

    // 2. Scan Python requirements.txt
    if (await fileExists('requirements.txt')) {
      const reqs = await readFileSafe('requirements.txt');
      if (reqs.includes('fastapi')) detected.backend = 'Python (FastAPI)';
      else if (reqs.includes('django')) detected.backend = 'Python (Django)';
      else if (reqs.includes('flask')) detected.backend = 'Python (Flask)';

      if (reqs.includes('psycopg2') || reqs.includes('asyncpg')) detected.database = 'PostgreSQL';
      else if (reqs.includes('pymongo')) detected.database = 'MongoDB';
      else if (reqs.includes('redis')) detected.cache = 'Redis';
      
      if (reqs.includes('pytest')) detected.testing = 'Pytest';
      if (reqs.includes('locust')) detected.testing = 'Locust';
      if (reqs.includes('sentry-sdk')) detected.observability = 'Sentry';
      if (reqs.includes('opentelemetry-api')) detected.observability = 'OpenTelemetry';
    }

    // 3. Scan Go mod file
    if (await fileExists('go.mod')) {
      const goMod = await readFileSafe('go.mod');
      if (goMod.includes('github.com/gin-gonic/gin')) detected.backend = 'Go (Gin)';
      else if (goMod.includes('github.com/gofiber/fiber')) detected.backend = 'Go (Fiber)';
      else if (goMod.includes('github.com/labstack/echo')) detected.backend = 'Go (Echo)';

      if (goMod.includes('github.com/lib/pq') || goMod.includes('github.com/jackc/pgx')) detected.database = 'PostgreSQL';
      if (goMod.includes('github.com/go-redis/redis')) detected.cache = 'Redis';
    }

    // 4. Orchestration / Deployment scan
    if (await fileExists('docker-compose.yml') || await fileExists('docker-compose.yaml')) {
      detected.orchestration = 'Docker Compose';
    } else if (await fileExists('Dockerfile')) {
      detected.orchestration = 'Docker Compose';
    }

    if (await fileExists('k8s') || await fileExists('kubernetes') || await fileExists('helm')) {
      detected.orchestration = 'Kubernetes (EKS/GKE/AKS)';
    }

    // Compute divergences
    const divergences: AuditResult['divergences'] = [];
    let matchCount = 0;
    let comparisonCount = 0;

    const checkCategory = (
      category: keyof typeof recommendation.recommendation,
      label: string,
      detectedVal: string | undefined
    ) => {
      const recVal = recommendation.recommendation[category];
      if (!recVal) return; // skip checking categories not recommended

      comparisonCount++;
      if (!detectedVal) {
        divergences.push({
          category: label,
          recommended: recVal,
          actual: 'None Detected',
          severity: 'medium',
          details: `Recommended ${recVal} but no implementation was found in the project directory.`
        });
      } else if (detectedVal.toLowerCase() !== recVal.toLowerCase() && !recVal.toLowerCase().includes(detectedVal.toLowerCase()) && !detectedVal.toLowerCase().includes(recVal.toLowerCase())) {
        divergences.push({
          category: label,
          recommended: recVal,
          actual: detectedVal,
          severity: 'high',
          details: `Divergence: Recommended ${recVal} but found ${detectedVal} instead.`
        });
      } else {
        matchCount++;
      }
    };

    checkCategory('frontend', 'Frontend', detected.frontend);
    checkCategory('backend', 'Backend', detected.backend);
    checkCategory('database', 'Database', detected.database);
    checkCategory('cache', 'Cache', detected.cache);
    checkCategory('aiFramework', 'AI Framework', detected.aiFramework);
    checkCategory('observability', 'Observability', detected.observability);
    checkCategory('messaging', 'Messaging', detected.messaging);
    checkCategory('testing', 'Testing', detected.testing);
    checkCategory('auth', 'Auth', detected.auth);
    checkCategory('orchestration', 'Orchestration', detected.orchestration);

    const alignmentScore = comparisonCount > 0 ? Math.round((matchCount / comparisonCount) * 100) : 100;

    return {
      detected,
      divergences,
      alignmentScore
    };
  }
}
