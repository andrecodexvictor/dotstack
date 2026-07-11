import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class DatabaseRule implements Rule {
  name = 'Database and Caching Rule';
  description = 'Decides database (Postgres, Mongo, SQLite, MySQL, Cassandra, Neo4j, Qdrant, DynamoDB) and caching solutions.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const name = brief.product.name.toLowerCase();
    const type = brief.product.type;
    const scale = brief.requirements.scale;
    const latency = brief.requirements.latency;
    const cloud = brief.constraints.cloud;

    // Cache scoring (evaluated first to avoid TypeScript type-narrowing error on scale)
    if (scale === 'high' || latency === 'low-latency') {
      registry.cache['Redis'] += 60;
      registry.cache['Memcached'] += 45;
      registry.cache['None'] -= 20;
      registry.rationales.cache = 'Redis recommended as an in-memory key-value data structure store to satisfy caching and session needs.';
    } else {
      registry.cache['None'] += 50;
      registry.rationales.cache = 'No caching tier recommended to maintain a simple, single-database infrastructure footprint.';
    }

    // Baseline database scores
    registry.database['PostgreSQL'] += 20;
    registry.database['MySQL'] += 15;
    registry.database['MongoDB'] += 15;
    registry.database['SQLite'] += 10;
    registry.database['Cassandra'] += 5;
    registry.database['Neo4j'] += 5;
    registry.database['Qdrant'] += 5;
    registry.database['DynamoDB'] += 10;

    // 1. AI-centric vector databases
    if (name.includes('ai') || name.includes('vector') || name.includes('rag') || name.includes('embedding') || name.includes('search')) {
      registry.database['Qdrant'] += 75;
      registry.rationales.database = 'Qdrant vector database recommended to store semantic embeddings and handle high-speed similarity search.';
      return;
    }

    // 2. Serverless Cloud database preference
    if (cloud === 'Supabase') {
      registry.database['PostgreSQL'] += 60;
      registry.rationales.database = 'PostgreSQL recommended natively due to Supabase PostgreSQL-as-a-service cloud selection.';
      return;
    }

    // 3. Low Scale / CLI
    if (scale === 'low' || type === 'CLI') {
      registry.database['SQLite'] += 65;
      registry.rationales.database = 'SQLite recommended to keep the application self-contained, file-based, and serverless.';
      return;
    }

    // 4. High Scale Distributed wide-column database
    if (scale === 'high') {
      registry.database['PostgreSQL'] += 40;
      registry.database['Cassandra'] += 35;
      registry.database['DynamoDB'] += 35;
      registry.rationales.database = 'PostgreSQL or distributed DynamoDB/Cassandra recommended to handle high-concurrency transacting.';
      return;
    }

    // 5. Default Relational
    registry.database['PostgreSQL'] += 40;
    registry.rationales.database = 'PostgreSQL recommended as the standard open-source relational database for transactional safety.';
  }
}
