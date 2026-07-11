# Project Overview - dotstack

## 1. Product Vision & Goals
`dotstack` is a deterministic, rule-based technology stack recommendation engine built for human developers and AI coding agents. It consumes a project brief (`dotstack-project.yaml`), applies architectural heuristics, and writes machine-readable files (`stack.yaml` and developer guides) to help keep codebases consistent and avoid over-engineering.

---

## 2. Core Schema Enums
Input parameters are defined inside `dotstack-project.yaml` and validated using Zod:

- **Product Types**: `SaaS`, `API`, `MobileApp`, `CLI`, `InternalTool`, `WebApp`
- **Team Experience**: `junior`, `intermediate`, `senior`
- **Scale Requirements**: `low`, `medium`, `high`
- **Latency Budgets**: `normal`, `low-latency`
- **Availability Needs**: `normal`, `high-availability`
- **Constraint Overrides**: `language` (TypeScript, Python, Go, Java), `database` (PostgreSQL, MongoDB, SQLite, Redis), `cloud` (AWS, Vercel, Render, Docker), and `budget` (numeric budget in USD).

---

## 3. Rules Engine Heuristics
The scoring algorithm mutate values for stack candidates:

1. **Architecture Style**: Small teams (< 6 devs) are heavily discouraged from using microservices (-100 points) to save setup overhead. Favor Monolith or Modular Monolith instead.
2. **Frontend Framework**: Disables frontend for `API` and `CLI`. React is default; Svelte/Vue are preferred for junior teams due to lower learning curve; Next.js is preferred for high scale.
3. **Backend Framework**: Go (Gin) is scored for low-latency; NestJS is default for TypeScript; FastAPI for junior Python; Spring Boot for large-scale enterprise JVM requirements.
4. **Database & Caching**: SQLite is selected for low-scale/CLI; PostgreSQL for medium-to-high SQL; MongoDB for unstructured data; Redis is added as a cache layer if high scale/low-latency are required.
5. **Deployment Target**: Render/Vercel are chosen for low budget/small teams; AWS/Docker for high scale with larger teams.
