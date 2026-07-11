# dotstack

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/)
[![CI status](https://img.shields.io/badge/CI-passing-success.svg)](https://github.com/andrecodexvictor/dotstack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**dotstack** is a deterministic, rule-based technology stack recommendation engine built for human developers and AI coding agents. It evaluates project scopes and constraints to deliver optimal architectural selections, complete with curated design patterns and template references.

![dotstack Architecture](./docs/assets/dotstack_architecture_schematic.png)

Instead of re-teaching every AI coding tool your project's architectural decisions from scratch, `dotstack` provides a durable, tool-agnostic stack configuration layer. When run, it generates structured stack manifests that travel with the project across whatever editor or agent harness you use next.

The goal is not only to suggest a tech stack, but to make system boundaries **explicit, legibly constrained, and easily auditable by AI agents**.

---

## What Dotstack Is

`dotstack` is three things at once:
1. 📝 **A Standard Input Specification**: A simple `dotstack-project.yaml` defining product goals, scale, budget, and team experience.
2. ⚙️ **A Pure TypeScript Rules Engine**: A deterministic scoring compiler decoupled from Node.js (usable in CLI, browser, serverless, or MCP runtimes).
3. 📦 **An Agent-Friendly Output layer**: Formats results directly into a `.stack/` directory (standalone) or `./.context/dotstack/` directory (when integrated with context managers) containing:
   - `stack.yaml`: Machine-readable recommendations for AI tools and MCP servers.
   - `README.md`: A tailored developer guide containing rationales, risk warnings, and curated design pattern references.

---

## Why Dotstack Exists

Most early-stage projects suffer from common architectural breakdowns:
- **Developer Bias**: Selecting overly complex stacks (e.g., microservices for a 2-developer team) due to personal preferences rather than project constraints.
- **Agent Context Drift**: AI coding assistants (like Claude Code, Cursor, Copilot, or Windsurf) often suggest out-of-bounds libraries or conflicting design patterns because the tech stack rules aren't explicitly documented in the repository.
- **Over-Engineering**: Lack of guardrails to penalize operational complexity during bootstrapping.

`dotstack` solves this by introducing a deterministic scoring logic based on architectural heuristics, mapping recommendations directly to curated pattern codebases on GitHub.

---

## Getting Started / Como Começar

### Path 1: Standalone CLI (English)
Use the CLI to initialize your project parameters and generate stack recommendations.

1. **Initialize project brief**:
   ```bash
   npx dotstack init
   ```
   *This creates a default template `dotstack-project.yaml` in your working directory.*

2. **Evaluate recommendations**:
   ```bash
   npx dotstack recommend
   ```
   *This evaluates your parameters and outputs recommendation files to `.stack/` (or `.context/dotstack/` if a context manager directory exists).*

3. **Instruct your AI tool**:
   Prompt your IDE agent or MCP assistant:
   > *"Read `.stack/stack.yaml` and `.stack/README.md`. Adhere strictly to these stack limits and pattern references during all code changes."*

---

### Caminho 2: CLI Local (Português)
Use o CLI para configurar os parâmetros do seu projeto e receber a recomendação ideal de stack.

1. **Inicializar a configuração**:
   ```bash
   npx dotstack init
   ```
   *Isso criará o arquivo modelo `dotstack-project.yaml` no diretório atual.*

2. **Gerar recomendações**:
   ```bash
   npx dotstack recommend
   ```
   *Isso analisa os requisitos e gera os relatórios em `.stack/` (ou em `.context/dotstack/` se a pasta `.context/` estiver presente).*

3. **Instruir o seu Agente de IA**:
   Adicione o seguinte comando no prompt do seu editor (Cursor, Claude Code, Copilot, etc.):
   > *"Leia o arquivo `.stack/stack.yaml` e `.stack/README.md`. Siga rigorosamente essas diretrizes de tecnologia e padrões de projeto nas próximas edições de código."*

---

## Core Concepts

### 1. The Project Brief Schema (`dotstack-project.yaml`)
A single, clean configuration file defining system parameters:

```yaml
product:
  name: "My App"
  type: "SaaS" # SaaS, API, MobileApp, CLI, InternalTool, WebApp

team:
  devs: 3 # Number of developers
  experience: "intermediate" # junior, intermediate, senior

requirements:
  scale: "medium" # low, medium, high
  latency: "normal" # normal, low-latency
  availability: "normal" # normal, high-availability

constraints:
  # language: "TypeScript" # Optional overrides
  # database: "PostgreSQL"
  # cloud: "Render"
  # budget: 50
```

### 2. File Routing
`dotstack` is highly compatible with adjacent context tools:
- **Standalone**: If `./.context/` is absent, results are saved to `./.stack/stack.yaml` and `./.stack/README.md`.
- **Integrated Contexts**: If `./.context/` exists, outputs are saved directly to `./.context/dotstack/stack.yaml` and `./.context/dotstack/README.md`.

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

## CLI Reference

### `dotstack init`
Generates a template `dotstack-project.yaml` parameter file.
- `-o, --output <path>`: Custom path for configuration file (default: `dotstack-project.yaml`).

### `dotstack recommend`
Analyzes parameters, logs risk alerts (e.g. over-engineering flags), and writes output reports.
- `-f, --file <path>`: Path to project brief configuration (default: `dotstack-project.yaml`).
- `-r, --root <path>`: Project workspace root path for output routing (default: `.`).

---

## SDK / Programmatic API Usage

Because `dotstack` isolates its Core Domain via Ports and Adapters, you can import and run the rules engine in browsers, serverless functions, or custom extensions:

```typescript
import { RecommendationService } from 'dotstack';

const service = new RecommendationService();
const recommendation = service.recommend({
  product: { name: "Analytics Service", type: "API" },
  team: { devs: 4, experience: "senior" },
  requirements: { scale: "high", latency: "low-latency" }
});

console.log(recommendation.recommendation.backend); // Outputs: "Go (Gin)"
```

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
   *We use Vitest to run rules and file-routing unit tests.*

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
