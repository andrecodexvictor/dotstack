# Tooling & Productivity - dotstack

This document describes how to operate the CLI and MCP services.

---

## 1. CLI Commands

- **Initialize Config Brief**:
  ```bash
  dotstack init [-o output-file.yaml]
  ```
- **Recommend Tech Stack**:
  ```bash
  dotstack recommend [-f brief-file.yaml] [-r project-root]
  ```
- **Offline Semantic Codebase Search**:
  ```bash
  dotstack search "query string" [-r root-path] [-k top-k-results]
  ```
- **Launch Stdio MCP Server**:
  ```bash
  dotstack mcp start
  ```
- **Register MCP Server in Editor Settings**:
  ```bash
  dotstack mcp install [cursor|claude|all]
  ```

---

## 2. Local Semantic Search Pipeline
When `dotstack search "<query>"` is run:
1. Directory scanning reads files recursively (excluding binary formats, `node_modules`, `.git`, `.stack`, and `.context/dotstack`).
2. Files are chunked using a sliding window (30 lines per chunk, 10 lines overlap).
3. The engine tokenizes content, removes English stop words, and builds a TF-IDF index.
4. Matches are ranked by Cosine Similarity and returned as formatted markdown with file links.

---

## 3. MCP Server Stdio Tools
Exposes stdio services to LLM agents:
- **`dotstack_init`**: Templates project parameters.
- **`dotstack_recommend`**: Runs stack heuristics.
- **`dotstack_patterns`**: Resolves pattern links.
- **`dotstack_semantic_search`**: Scans, indexes, and searches codebases semantic chunks on the fly.
