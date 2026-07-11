# Codebase Architecture Context

`dotstack` is designed with Ports and Adapters (Hexagonal Architecture) to ensure the core rules engine can be embedded in any runtime environment (CLIs, browser-based portals, serverless functions, or MCP servers) without modifications.

---

## Architectural Diagram

```
           +---------------------------------------------+
           |              DRIVING ADAPTERS               |
           |   Exposes CLI commands and program entry    |
           |                                             |
           |   [CLI Adapter]          [MCP Adapter]      |
           |    (Commander)            (Future MCP)      |
           |         |                       |           |
           +---------|-----------------------|-----------+
                     |                       |
                     v                       v
           +---------------------------------------------+
           |                DRIVING PORTS                |
           |   Defines the SDK interface for consumers   |
           |                                             |
           |        [RecommendationUseCase Port]         |
           |                      |                      |
           +----------------------|----------------------+
                                  |
                                  v
           +---------------------------------------------+
           |                 CORE DOMAIN                 |
           |   Pure business rules, enums, & schemas.    |
           |   No side-effects or Node runtime dependencies |
           |                                             |
           |   [RecommendationService]                   |
           |             |                               |
           |             v                               |
           |      [Rules Engine]                         |
           |       - rules/*                             |
           |             |                               |
           |             v                               |
           |      [Pattern Registry]                     |
           |                                             |
           +----------------------|----------------------+
                                  |
                                  v
           +---------------------------------------------+
           |                DRIVEN PORTS                 |
           |   Declares abstract interfaces for I/O      |
           |                                             |
           |     [FileSystemPort]      [LoggerPort]      |
           |            |                    |           |
           +------------|--------------------|-----------+
                        |                    |
                        v                    v
           +---------------------------------------------+
           |              DRIVEN ADAPTERS                |
           |   Implements I/O using specific runtimes    |
           |                                             |
           |   [NodeFS Adapter]      [ConsoleLogger]     |
           |    (fs/promises)          (picocolors)      |
           |                                             |
           +---------------------------------------------+
```

---

## Structural Guidelines

1. **Dependency Direction**:
   - All arrows point inward to the Core Domain.
   - Core Domain must never depend on any adapter class or Node.js packages (e.g., `fs`, `path`).
   - Adapters inject their implementations at startup/CLI level.

2. **Core Domain Isolation**:
   - Validation schema definitions (Zod) reside entirely in `src/core/models/brief.ts`.
   - Scoring rules under `src/core/rules/` inherit from `Rule` and process `ProjectBrief` to mutate `ScoringRegistry` values.

3. **Driven Adapters (Side-effects)**:
   - File system reading/writing and output path routing (`.context/dotstack/` vs `.stack/`) are isolated in `src/adapters/fs/node-fs.adapter.ts` behind `FileSystemPort`.
   - Terminal color formatting is isolated in `src/adapters/logger/console-logger.adapter.ts` behind `LoggerPort`.
