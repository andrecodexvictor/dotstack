# dotstack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**dotstack** is an open-source, deterministic, rule-based technology stack recommendation toolkit for developers and AI agents. It consumes a project brief (`dotstack-project.yaml`), applies proven software architecture heuristics, and generates structured stack specifications and guidelines.

`dotstack` is designed to be **standalone** (requires no companion services) and **agent-friendly** (outputs clean, structured YAML/Markdown that AI coding agents can read to follow architectural decisions).

---

## Features

- ⚙️ **Deterministic Recommendation Engine**: Evaluates architecture style, frontend, backend, database, caching, and cloud targets based on team size, expected scale, experience, and budget.
- 📦 **Design Pattern Registry**: Connects recommended components with curated architectural patterns (e.g., Repository, Clean Architecture, CQRS) and provides direct links to high-quality template/production GitHub repositories and RefactoringGuru URLs.
- 🤖 **Agent-First Output**: Outputs structural guidelines in `.context/dotstack/` or `.stack/` so that LLMs and MCP servers can instantly understand the architectural boundaries of your project.
- 🔌 **Ports & Adapters (Hexagonal) Architecture**: Core logic is written in pure TypeScript (zero Node.js dependencies), allowing the rules engine to run in browsers, serverless runtimes, CLIs, or MCP servers.

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/andrecodexvictor/dotstack.git
   cd dotstack
   ```

2. **Install dependencies and compile**:
   ```bash
   npm install
   npm run build
   ```

3. **Link CLI globally** (Optional):
   ```bash
   npm link
   ```

---

## CLI Usage

### 1. Initialize a Project Brief
Generate a template brief `dotstack-project.yaml` in your workspace:
```bash
dotstack init
```
Or specify a custom path:
```bash
dotstack init -o config/my-project.yaml
```

### 2. Generate Recommendations
Run the engine to evaluate your brief:
```bash
dotstack recommend
```
Or specify input file and workspace root parameters:
```bash
dotstack recommend -f config/my-project.yaml -r ./my-project-root
```

---

## Project Brief Schema (`dotstack-project.yaml`)

Edit the generated brief using the following fields:

```yaml
product:
  name: "My SaaS App"
  type: "SaaS" # Enums: SaaS, API, MobileApp, CLI, InternalTool, WebApp

team:
  devs: 3 # Number of developers
  experience: "intermediate" # Enums: junior, intermediate, senior

requirements:
  scale: "medium" # Enums: low, medium, high
  latency: "normal" # Enums: normal, low-latency
  availability: "high" # Enums: normal, high-availability

constraints:
  language: "TypeScript" # Optional override (TypeScript, Python, Go, Java)
  database: "PostgreSQL" # Optional override (PostgreSQL, MongoDB, SQLite, Redis)
  cloud: "Render" # Optional override (AWS, Vercel, Render, Docker)
  budget: 100 # Optional max monthly budget in USD
```

---

## Workspace Integration

`dotstack` automatically detects where to write outputs based on your repository layout:

- **Integrated with context managers**: If a `.context/` directory exists in the workspace root, `dotstack` writes files to:
  - `.context/dotstack/stack.yaml` (Structured YAML for tooling/agents)
  - `.context/dotstack/README.md` (Markdown summary detailing rationales and patterns)
- **Standalone**: If no `.context/` directory exists, outputs are written to:
  - `.stack/stack.yaml`
  - `.stack/README.md`

### How AI Coding Agents Consume dotstack
You can instruct your IDE agents, MCP servers, or prompt templates to read these outputs at the start of a coding session:
> *"Read `.context/dotstack/stack.yaml` and `.context/dotstack/README.md`. Strictly adhere to the recommended languages, frameworks, databases, and architectural patterns (e.g., Repository Pattern, Clean Architecture) during modifications."*

---

## SDK / Programmatic Library Usage

Because of its Hexagonal design, `dotstack` can be imported directly into other TypeScript/JavaScript codebases:

```typescript
import { RecommendationService } from 'dotstack';

const service = new RecommendationService();
const recommendation = service.recommend({
  product: { name: "My SDK App", type: "API" },
  team: { devs: 4, experience: "senior" },
  requirements: { scale: "high", latency: "low-latency" }
});

console.log(recommendation.recommendation.backend); // Outputs: "Go (Gin)"
```

---

## Extensibility & Contribution

To add or modify recommendation rules:
1. Navigate to `src/core/rules/`.
2. Create or edit rules that implement the `Rule` interface.
3. Register your rule in `RecommendationService` (`src/core/services/recommendation.service.ts`).

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
