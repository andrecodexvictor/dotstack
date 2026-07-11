---
name: verify-stack-compliance
description: Guide for coding agents to check repository dependencies and files against recommended dotstack parameters.
---

# Skill: Verify Stack Compliance

Use this skill when you want to verify that a repository's codebase matches the recommended technology stack.

## Step-by-Step Instructions

1. **Locate the Stack Specification**:
   - Check if `.context/dotstack/stack.yaml` or `.stack/stack.yaml` exists.
   - If not found, abort and report to the user that they must run `npx dotstack recommend` first.

2. **Read Stack Specifications**:
   - Parse the YAML file and extract values from the `recommendation` block:
     - `frontend`
     - `backend`
     - `database`
     - `deployment`

3. **Check Dependencies**:
   - Scan codebase dependency manifests:
     - **Node.js**: Inspect `dependencies` and `devDependencies` in `package.json`.
     - **Python**: Check `requirements.txt` or `pyproject.toml`.
     - **Go**: Inspect `go.mod`.
     - **Java**: Inspect `pom.xml` or `build.gradle`.
   - Verify that packages match:
     - If database is `PostgreSQL`, verify PostgreSQL drivers (e.g. `pg`, `psycopg2`, `pgx`) are present.
     - If database is `SQLite`, verify SQLite packages (e.g. `sqlite3`, `better-sqlite3`, `sqlite`) are present.
     - If backend is `TypeScript (NestJS)`, verify NestJS core modules are present.

4. **Scan Code Imports**:
   - Verify that code files do not import out-of-bounds libraries.
   - Raise an alert if conflicts are found.
