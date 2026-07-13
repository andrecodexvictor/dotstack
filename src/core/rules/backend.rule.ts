import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class BackendRule implements Rule {
  name = 'Backend Framework Rule';
  description = 'Decides backend framework from 19 candidates based on scale, latency, cloud preferences, and team profiles.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const devs = brief.team.devs;
    const experience = brief.team.experience;
    const scale = brief.requirements.scale;
    const latency = brief.requirements.latency;
    const cloud = brief.constraints.cloud;

    // Baseline scores
    registry.backend['TypeScript (Express)'] += 10;
    registry.backend['TypeScript (NestJS)'] += 20;
    registry.backend['TypeScript (Fastify)'] += 15;
    registry.backend['TypeScript (Hono)'] += 15;
    registry.backend['Python (FastAPI)'] += 20;
    registry.backend['Python (Django)'] += 15;
    registry.backend['Python (Flask)'] += 10;
    registry.backend['Go (Gin)'] += 15;
    registry.backend['Go (Fiber)'] += 15;
    registry.backend['Go (Echo)'] += 15;
    registry.backend['Rust (Axum)'] += 10;
    registry.backend['Rust (Actix-web)'] += 10;
    registry.backend['Ruby (Ruby on Rails)'] += 15;
    registry.backend['Elixir (Phoenix)'] += 15;
    registry.backend['PHP (Laravel)'] += 15;
    registry.backend['PHP (Symfony)'] += 10;
    registry.backend['Java (Spring Boot)'] += 10;
    registry.backend['Kotlin (Ktor)'] += 10;
    registry.backend['CSharp (ASP.NET Core)'] += 10;
    registry.backend['C++ (Drogon)'] += 10;
    registry.backend['C++ (Crow)'] += 10;
    registry.backend['C (Native/CGI)'] += 5;

    // 1. Edge-first Cloudflare Workers
    if (cloud === 'Cloudflare') {
      registry.backend['TypeScript (Hono)'] += 70;
      registry.rationales.backend = 'TypeScript (Hono) recommended for Cloudflare Workers deployment due to minimal footprint, high performance, and edge compatibility.';
      return;
    }

    // 2. High Scale & Low-Latency
    if (latency === 'low-latency') {
      registry.backend['Rust (Axum)'] += 60;
      registry.backend['C++ (Drogon)'] += 55;
      registry.backend['Go (Gin)'] += 50;
      registry.backend['Elixir (Phoenix)'] += 45;
      registry.rationales.backend = 'Rust (Axum), C++ (Drogon), or Go (Gin) recommended to satisfy strict low-latency constraints and resource efficiency.';
      return;
    }

    // 3. Fast Prototyping for Solo/Duo Developers (Rapid MVC)
    const isAiSupported = !!brief.team.aiSupported || !!brief.team.onePersonBillionBusiness;
    if (devs <= 2 && (brief.product.type === 'SaaS' || brief.product.type === 'WebApp') && scale !== 'high' && !isAiSupported) {
      registry.backend['Ruby (Ruby on Rails)'] += 55;
      registry.backend['PHP (Laravel)'] += 50;
      registry.backend['Python (Django)'] += 35;
      registry.rationales.backend = 'Ruby on Rails or Laravel recommended for small teams to leverage built-in authentication, ORM, and admin panels, maximizing prototype speed.';
      return;
    }

    // 4. Large Enterprise Teams
    if (scale === 'high' && devs >= 6) {
      registry.backend['CSharp (ASP.NET Core)'] += 50;
      registry.backend['Java (Spring Boot)'] += 50;
      registry.backend['TypeScript (NestJS)'] += 40;
      registry.rationales.backend = 'C# (ASP.NET Core) or Java (Spring Boot) recommended for large teams needing statically typed, highly structured enterprise architectures.';
      return;
    }

    // 5. Junior Teams
    if (experience === 'junior') {
      registry.backend['Python (FastAPI)'] += 40;
      registry.backend['PHP (Laravel)'] += 35;
      registry.backend['TypeScript (Express)'] += 30;
      registry.rationales.backend = 'Python (FastAPI) recommended due to its easy-to-learn syntax, auto-generated docs, and quick ramp-up.';
      return;
    }

    // 6. Default Fallback
    registry.backend['TypeScript (NestJS)'] += 30;
    registry.rationales.backend = 'TypeScript (NestJS) recommended for modularity, strict typing, and structured architecture.';
  }
}
