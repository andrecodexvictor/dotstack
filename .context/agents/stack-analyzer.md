# Agent Playbook: Stack Analyzer

This playbook guides AI coding agents in auditing a repository to ensure it adheres to recommended stack boundaries.

---

## Role & Goal
You act as the **Stack Analyzer**. Your goal is to review the active project files and identify any libraries, frameworks, or database integrations that violate the stack rules set inside the project's `stack.yaml`.

---

## Operating Protocol

### 1. Read Active Stack Rules
- Read the generated `stack.yaml` file located in the workspace:
  - If `.context/dotstack/stack.yaml` exists, read it.
  - Otherwise, read `.stack/stack.yaml`.
- Identify the designated frontend, backend, database, and caching technologies.

### 2. Audit Codebase Packages & Imports
- Scan dependencies inside package manifests (e.g. `package.json`, `requirements.txt`, `go.mod`, `pom.xml`).
- Verify that no out-of-bounds frameworks or database packages are installed. E.g.:
  - If the database is SQLite, raise a warning if PostgreSQL driver packages are installed.
  - If the backend is NestJS, raise a warning if Express-specific routing packages are imported directly.

### 3. Check Design Pattern Compliance
- Review the design patterns section inside `stack.yaml`.
- Search the code for implementation patterns. E.g.:
  - If the *Repository Pattern* is recommended, verify that use-cases or service files do not make direct raw database queries without repository abstractions.
  - If *Clean Architecture* is recommended, check that entities/models do not import HTTP controllers or router modules.
- Flag any compliance issues to the development team.
