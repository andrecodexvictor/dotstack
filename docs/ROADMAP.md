# Dotstack Product Roadmap

This document outlines the multi-phase roadmap to transform Dotstack into a comprehensive architecture engine.

## Phase 0: Base & Schema Formalization (Completed)
- [x] Extend `ProjectBriefSchema` with optional attributes: compliance, residency, tenants, real-time, HA, security.
- [x] Create formal JSON Schema validation: `docs/schema/dotstack-project.schema.json`.
- [x] Map current technology matrix coverage in `docs/coverage/current.md`.
- [x] Reach target core test coverage (exceeding 80%).

## Phase 1: Expanded Database Catalog (Completed)
- [x] Expand databases selection heuristics in rules engine.
- [x] Add Amazon Aurora, AWS RDS, GCP Cloud SQL, Spanner, Azure SQL, CosmosDB, and serverless options (Supabase, PlanetScale, Neon).
- [x] Create database decision guide: `docs/coverage/databases.md`.

## Phase 2: Messaging & Observability (Completed)
- [x] Implement selection rules for messaging systems: Apache Kafka, RabbitMQ, SQS, NATS, EventBridge.
- [x] Add OpenTelemetry, Prometheus, Loki, Sentry observability recommendations.
- [x] Expand Design Patterns matrix with Saga, Outbox, Event Sourcing, Zero Trust, Sidecar.
- [x] Create `docs/coverage/messaging.md` and `docs/coverage/observability-and-testing.md`.

## Phase 3: CLI Report Generation (Completed)
- [x] Add `--format json|markdown` to CLI recommendations.
- [x] Add `--output` custom filepath routing and `--dry-run` modes.
- [x] Write report formatter module in `src/core/report`.

## Phase 4: New MCP Agent Tools (Completed)
- [x] Implement `dotstack_audit` dependency scanner and alignment tool.
- [x] Implement `dotstack_migrate` phased migration planner.
- [x] Implement `dotstack_docs` programmatic ADR generator.

## Phase 5: Pluggable Semantic Search (Completed)
- [x] Introduce `SearchBackend` pluggable boundaries.
- [x] Support indexing: Dockerfile, docker-compose, terraform (*.tf, *.hcl), Prisma schema, GraphQL, env examples, Makefiles.
- [x] Dramatically expand test suite to 18 unit/integration tests with >80% code coverage.

## Phase 6: Ecosystem & Community (Current)
- [ ] SPA Dashboard to view recommendations visually (`apps/dotstack-dashboard`).
- [ ] Versioning database decisions and timeline analysis.
