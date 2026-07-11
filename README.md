# dotstack

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/)
[![CI status](https://img.shields.io/badge/CI-passing-success.svg)](https://github.com/andrecodexvictor/dotstack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**dotstack** is a deterministic, rule-based technology stack recommendation engine built for human developers and AI coding agents. It evaluates project scopes and constraints to deliver optimal architectural selections, complete with curated design patterns, template references, and **offline vector space semantic search**.

![dotstack Architecture](./docs/assets/dotstack_architecture_schematic.png)

Instead of re-teaching every AI coding tool your project's architectural decisions from scratch, `dotstack` provides a durable, tool-agnostic stack configuration layer. 

By exposing a native **Model Context Protocol (MCP) server** and an **offline semantic search engine**, agents can automatically read, validate, and search codebases under the target architecture's constraints.

---

## What Dotstack Is

`dotstack` is three things at once:
1. 📝 **A Standard Input Specification**: A simple `dotstack-project.yaml` defining product goals, scale, budget, and team experience.
2. ⚙️ **A Pure TypeScript Rules Engine & Search Engine**: A deterministic scoring compiler and a local TF-IDF vector space engine decoupled from Node.js (usable in CLI, browser, serverless, or MCP runtimes).
3. 📦 **An Agent-Friendly Tool Surface**: Exposes recommendations, patterns, and semantic search to CLI shells and MCP-enabled AI clients (Cursor, Claude Code, Windsurf, Claude Desktop, etc.).

---

## Getting Started / Como Começar

### Path 1: Agent & IDE Integration via MCP (Recommended)
Use this path to automatically register the `dotstack` tools in your AI editors.

1. **Build and install MCP server**:
   ```bash
   npm run build
   npx dotstack mcp install
   ```
   *This automatically detects your system configuration and registers the `dotstack` MCP server in **Cursor** and **Claude Desktop**.*

2. **Prompt your AI agent**:
   AI agents can now run stack audits and semantic codebase searches using these tools:
   - `dotstack_init`: Instantiates parameter files.
   - `dotstack_recommend`: Evaluates project briefs and writes recommendation reports.
   - `dotstack_patterns`: Resolves design pattern guidelines and templates.
   - `dotstack_semantic_search`: Performs offline vector space searches over code chunks.

---

### Path 2: Standalone CLI & Local Semantic Search
Use this path to initialize, evaluate, and search repositories directly from the terminal.

1. **Initialize project brief**:
   ```bash
   npx dotstack init
   ```
   *Creates a default template `dotstack-project.yaml` in your working directory.*

2. **Generate recommendations**:
   ```bash
   npx dotstack recommend
   ```
   *Evaluates your parameters and outputs recommendation reports to `.stack/` (or `.context/dotstack/` if a context manager directory exists).*

3. **Perform local semantic searches**:
   Run an offline token-vector search over code chunks in your repository:
   ```bash
   npx dotstack search "database connection cache rules"
   ```
   *Scans files recursively, constructs a local TF-IDF index, computes cosine similarity, and outputs matching code snippets with scores and deep links.*

---

### Caminho em Português: Integração & CLI Local

1. **Configurar o Servidor MCP**:
   ```bash
   npm run build
   npx dotstack mcp install
   ```
   *Registra automaticamente as ferramentas do `dotstack` no seu **Cursor** ou **Claude Desktop**.*

2. **Buscar código semanticamente offline**:
   ```bash
   npx dotstack search "regras da engine de recomendação"
   ```
   *Varre a base de código, calcula pesos TF-IDF e retorna os trechos de código mais semelhantes (cosseno de similaridade).*

---

## CLI Reference

### `dotstack init`
Generates a template `dotstack-project.yaml` parameter file.
- `-o, --output <path>`: Custom path for configuration file (default: `dotstack-project.yaml`).

### `dotstack recommend`
Analyzes parameters, logs risk alerts (e.g. over-engineering flags), and writes output reports.
- `-f, --file <path>`: Path to project brief configuration (default: `dotstack-project.yaml`).
- `-r, --root <path>`: Project workspace root path for output routing (default: `.`).

### `dotstack search <query>`
Scans codebases and runs local TF-IDF token vector cosine similarity matching.
- `-r, --root <path>`: Workspace directory to scan (default: `.`).
- `-k, --top-k <number>`: Maximum matching code blocks to return (default: `5`).

### `dotstack mcp start`
Starts the stdio-based MCP server.

### `dotstack mcp install [target]`
Automatically registers the stdio MCP server in local Cursor and/or Claude Desktop configurations.
- `target`: `cursor`, `claude`, or `all` (default: `all`).

---

## SDK / Programmatic API Usage

Because `dotstack` isolates its Core Domain via Ports and Adapters, you can import and run the rules engine or the semantic search indexer in browsers, serverless functions, or custom extensions:

```typescript
import { RecommendationService, SemanticSearchService } from 'dotstack';

// 1. Get recommendation
const service = new RecommendationService();
const recommendation = service.recommend({
  product: { name: "Analytics Service", type: "API" },
  team: { devs: 4, experience: "senior" },
  requirements: { scale: "high", latency: "low-latency" }
});

console.log(recommendation.recommendation.backend); // Outputs: "Go (Gin)"

// 2. Perform programmatical search
const searchService = new SemanticSearchService();
const matches = searchService.search([
  { relativePath: "index.js", content: "const app = express();" }
], "express app setup");
```

---

## Curated Pattern & Ecosystem Mappings

For every recommended stack, `dotstack` embeds direct references to educational codebases and architecture guides:

| Stack Recommendation | Embedded Patterns | Curated Reference Repository |
| :--- | :--- | :--- |
| **TypeScript (NestJS) + PostgreSQL** | Clean Architecture, Repository, CQRS, DI | [nestjs-realworld-example-app](https://github.com/lujakob/nestjs-realworld-example-app) |
| **TypeScript (Express) + PostgreSQL** | Ports & Adapters, Service Boundary | [node-clean-architecture](https://github.com/fityanu/node-clean-architecture) |
| **Go (Gin) + PostgreSQL** | Clean Architecture, Repository | [go-clean-arch](https://github.com/bxcodec/go-clean-arch) |
| **Python (Django) + PostgreSQL** | Model-View-Template (MVT) | [cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) |
| **Java (Spring Boot)** | Dependency Injection, IoC, Repository | [spring-boot-api-project](https://github.com/maciejwalkowiak/spring-boot-api-project) |

---

## Developer Guide & Codebase Contributions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Verify and run tests**:
   ```bash
   npm run test
   ```
   *We use Vitest to run rules, file-routing, and semantic search unit tests.*

3. **Build compiled assets**:
   ```bash
   npm run build
   ```
   *Compiles source code into ESM JavaScript under `dist/`.*

---

## License & Credits

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

- **Author**: André Victor A. O. Santos
- **Inspiration**: Strongly inspired by [dotcontext](https://github.com/andrecodexvictor/dotarchitecture) repo conventions.
