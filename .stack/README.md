# Recommended Architecture: Monolith

This repository technology stack was recommended by **dotstack**.

## Technology Stack Summary

| Component | Selected Technology | Rationale |
| :--- | :--- | :--- |
| **Architecture Style** | Monolith | Monolith chosen because the team is small (1 dev(s)). Minimizes infrastructure and synchronization overhead. |
| **Frontend Framework** | None | No frontend framework recommended because the product is an API or CLI. |
| **Backend Framework** | TypeScript (NestJS) | Backend framework forced to TypeScript (NestJS) due to language constraint preference for TypeScript. |
| **Database** | SQLite | SQLite recommended to keep the application self-contained, file-based, and serverless. |
| **Deployment Target** | Docker (Self-hosted) | Docker (Self-hosted) recommended to package applications into standard, portable container images. |

## Architectural Risks & Warnings

> [!WARNING]
> **Microservices are discouraged for teams with only 1 developer(s) due to overhead.**

## Design Patterns & Ecosystem References

To maintain code quality and architectural integrity, the following patterns are recommended for this stack:

### 1. Clean Architecture (Hexagonal / Ports & Adapters)
Organizes application logic in concentric rings where dependency flow points inward, keeping entities and use-cases independent of external delivery mechanisms (CLI, HTTP, DB).

- **Reference Docs**: [GitHub Topic / RefactoringGuru](https://github.com/topics/clean-architecture)
- **Reference Repositories**:
  - [Express Clean Architecture Skeleton](https://github.com/fityanu/node-clean-architecture) - A modular Express boilerplate employing strict Ports & Adapters hierarchy.
  - [Go Clean Architecture Template](https://github.com/bxcodec/go-clean-arch) - Reference implementation of Clean Architecture using standard Go packages.
  - [Architecture Patterns in Python](https://github.com/cosmicpython/book) - Accompanying code for the Cosmic Python book illustrating Unit of Work, Repository, and Service Layer patterns.

### 1. CQRS (Command Query Responsibility Segregation)
Separates read models from write models, allowing queries and commands to scale independently under heavy scale requirements.

- **Reference Docs**: [GitHub Topic / RefactoringGuru](https://github.com/topics/cqrs)
- **Reference Repositories**:
  - [NestJS CQRS Module Implementation](https://github.com/kamilmysliwiec/nest-cqrs-example) - Official NestJS example showcasing commands, queries, events, and sagas.

### 1. Dependency Injection
A design pattern in which an object receives other objects that it depends on, decoupling object creation from usage.

- **Reference Docs**: [GitHub Topic / RefactoringGuru](https://refactoring.guru/design-patterns/dependency-injection)
- **Reference Repositories**:
  - [Spring Boot API skeleton](https://github.com/maciejwalkowiak/spring-boot-api-project) - Production-ready Spring Boot boilerplate demonstrating IoC, Dependency Injection, and structural configurations.

---
*Generated automatically by dotstack on 12/07/2026.*
