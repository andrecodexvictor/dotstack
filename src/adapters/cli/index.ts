#!/usr/bin/env node

import { Command } from 'commander';
import { RecommendationService } from '../../core/services/recommendation.service.js';
import { NodeFileSystemAdapter } from '../fs/node-fs.adapter.js';
import { ConsoleLoggerAdapter } from '../logger/console-logger.adapter.js';
import { startMcpServer } from '../mcp/mcp.adapter.js';
import { installMcpServer } from './mcp-installer.js';
import { SemanticSearchService } from '../../core/services/semantic-search.service.js';
import { generateMarkdownReport, generateJSONReport } from '../../core/report/index.js';
import fs from 'fs/promises';
import path from 'path';
import pc from 'picocolors';
import { fileURLToPath } from 'url';
import { ProjectBrief } from '../../core/models/brief.js';

const program = new Command();
const logger = new ConsoleLoggerAdapter();
const fileSystem = new NodeFileSystemAdapter();
const service = new RecommendationService();

program
  .name('dotstack')
  .description('MIT licensed CLI for recommending technology stacks based on project briefs.')
  .version('1.0.0');

// init command
program
  .command('init')
  .description('Generate a template dotstack-project.yaml brief in the current directory')
  .option('-o, --output <path>', 'Output file path', 'dotstack-project.yaml')
  .action(async (options) => {
    const templateContent = `# dotstack-project.yaml
# Configuration file for recommending your technology stack.

product:
  name: "My App"
  type: "SaaS" # Options: SaaS, API, MobileApp, CLI, InternalTool, WebApp

team:
  devs: 3 # Number of developers on the project
  experience: "intermediate" # Options: junior, intermediate, senior

requirements:
  scale: "medium" # Options: low, medium, high
  latency: "normal" # Options: normal, low-latency
  availability: "normal" # Options: normal, high-availability

# Optional constraints to force specific choices (overrides rules engine scores)
constraints:
  # language: "TypeScript" # Options: TypeScript, Python, Go, Java
  # database: "PostgreSQL" # Options: PostgreSQL, MongoDB, SQLite, Redis
  # cloud: "Render" # Options: AWS, Vercel, Render, Docker
  # budget: 50 # Max monthly budget in USD
`;

    try {
      const outputPath = path.resolve(options.output);
      await fs.writeFile(outputPath, templateContent, 'utf8');
      logger.success(`Template created successfully at: ${outputPath}`);
      logger.info('Edit this file to match your project parameters, then run:\n  dotstack recommend');
    } catch (err: any) {
      logger.error(`Failed to create template: ${err.message}`);
      process.exit(1);
    }
  });

// recommend command
program
  .command('recommend')
  .description('Run stack analysis and write stack.yaml + README.md recommendations')
  .option('-f, --file <path>', 'Path to the project brief yaml', 'dotstack-project.yaml')
  .option('-r, --root <path>', 'Project root directory to write outputs', '.')
  .option('--format <type>', 'Format of the output report: text, json, markdown', 'text')
  .option('--verbose', 'Print verbose configuration settings', false)
  .option('--dry-run', 'Perform analysis but do not write output files to disk', false)
  .option('-o, --output <path>', 'Custom path to save generated report (JSON or Markdown)')
  .action(async (options) => {
    try {
      const briefPath = path.resolve(options.file);
      
      // Check if brief exists
      try {
        await fs.access(briefPath);
      } catch {
        logger.error(`Project brief file not found at: ${briefPath}`);
        logger.info('Please run `dotstack init` first to generate a template brief.');
        process.exit(1);
      }

      if (options.verbose) {
        logger.info(`Reading project brief from ${pc.cyan(briefPath)}...`);
      }
      const briefData = (await fileSystem.readBrief(briefPath)) as ProjectBrief;

      if (options.verbose) {
        logger.info('Evaluating architectural heuristics...');
      }
      const recommendation = service.recommend(briefData);

      // Handle custom formats
      if (options.format === 'json') {
        const jsonReport = generateJSONReport(recommendation, briefData, options.verbose);
        if (options.output) {
          const outPath = path.resolve(options.output);
          await fs.writeFile(outPath, jsonReport, 'utf8');
          logger.success(`Saved JSON report to: ${outPath}`);
        } else {
          console.log(jsonReport);
        }
        return;
      }

      if (options.format === 'markdown') {
        const mdReport = generateMarkdownReport(recommendation, briefData, options.verbose);
        if (options.output) {
          const outPath = path.resolve(options.output);
          await fs.writeFile(outPath, mdReport, 'utf8');
          logger.success(`Saved Markdown report to: ${outPath}`);
        } else {
          console.log(mdReport);
        }
        return;
      }

      // Default text / console formatting
      // Print risks/warnings
      if (recommendation.risks.length > 0) {
        console.log('');
        logger.warn('Architectural risk flags detected:');
        for (const risk of recommendation.risks) {
          console.log(pc.yellow(`  • ${risk}`));
        }
      }

      // Display recommendation table in console
      const r = recommendation.recommendation;
      const rat = recommendation.rationale;

      console.log('\n' + pc.bold(pc.green('=================== RECOMMENDED TECHNOLOGY STACK ===================')));
      const printRow = (label: string, value: string | undefined, explanation: string | undefined) => {
        if (!value) return;
        const paddedLabel = pc.bold(label.padEnd(20));
        const paddedValue = pc.cyan(value.padEnd(22));
        console.log(` ${paddedLabel} | ${paddedValue} | ${pc.dim(explanation || '')}`);
      };

      printRow('Architecture Style', r.architectureStyle, rat.architectureStyle);
      printRow('Frontend Framework', r.frontend, rat.frontend);
      printRow('Backend Framework', r.backend, rat.backend);
      printRow('Database System', r.database, rat.database);
      printRow('Caching Tier', r.cache, rat.cache);
      printRow('AI Orchestrator', r.aiFramework, rat.aiFramework);
      printRow('Deployment Target', r.deployment, rat.deployment);
      printRow('Observability', r.observability, rat.observability);
      printRow('Messaging / Queue', r.messaging, rat.messaging);
      printRow('Testing Framework', r.testing, rat.testing);
      printRow('Auth Provider', r.auth, rat.auth);
      printRow('Security Tools', r.security, rat.security);
      printRow('Orchestration', r.orchestration, rat.orchestration);
      printRow('Mobile Stack', r.mobile, rat.mobile);
      console.log(pc.bold(pc.green('====================================================================\n')));

      // Save outputs if not dry-run
      if (!options.dryRun) {
        const rootPath = path.resolve(options.root);
        logger.info(`Writing recommendation artifacts to workspace...`);
        const { yamlPath, mdPath } = await fileSystem.writeOutputs(recommendation, rootPath);

        logger.success('Artifacts generated successfully:');
        logger.info(`YAML Output: ${pc.cyan(yamlPath)}`);
        logger.info(`Markdown Output: ${pc.cyan(mdPath)}`);

        // If custom output specified for markdown, save report there too
        if (options.output) {
          const outPath = path.resolve(options.output);
          const mdReport = generateMarkdownReport(recommendation, briefData, options.verbose);
          await fs.writeFile(outPath, mdReport, 'utf8');
          logger.info(`Architecture Report saved to: ${pc.cyan(outPath)}`);
        }
      } else {
        logger.warn('Dry-run mode active. No files were written to disk.');
      }

    } catch (err: any) {
      logger.error(`Recommendation analysis failed: ${err.message}`);
      if (err.issues) {
        // Validation errors (Zod)
        logger.error('Brief schema validation details:');
        for (const issue of err.issues) {
          console.error(pc.red(`  path: "${issue.path.join('.')}" - ${issue.message}`));
        }
      }
      process.exit(1);
    }
  });

// mcp parent command
const mcpCmd = program
  .command('mcp')
  .description('Manage Model Context Protocol (MCP) server hooks and installs');

mcpCmd
  .command('start')
  .description('Start the stdio-based dotstack MCP server')
  .action(async () => {
    try {
      await startMcpServer();
    } catch (err: any) {
      logger.error(`MCP Server failed to start: ${err.message}`);
      process.exit(1);
    }
  });

mcpCmd
  .command('install')
  .description('Register dotstack MCP server in AI agent/editor configs (Claude Desktop, Claude Code, Cursor, VS Code Copilot, Windsurf, Codex CLI, and project .mcp.json)')
  .argument('[target]', 'Target: claude, cursor, vscode, windsurf, codex, or all', 'all')
  .action(async (target) => {
    try {
      const currentFile = fileURLToPath(import.meta.url);
      logger.info(`Configuring dotstack MCP for target "${pc.cyan(target)}" using path: ${pc.cyan(currentFile)}...`);
      const results = await installMcpServer(target as any, currentFile);
      if (results.length === 0) {
        logger.warn('No configurations were updated. Check that the target editors are installed.');
      }
      for (const res of results) {
        console.log(res);
      }
      logger.success(`MCP installation complete. ${results.length} agent config(s) updated.`);
    } catch (err: any) {
      logger.error(`MCP Installation failed: ${err.message}`);
      process.exit(1);
    }
  });

// search command
program
  .command('search')
  .description('Search local codebase using TF-IDF token vector cosine similarity (offline semantic search)')
  .argument('<query>', 'Semantic query string')
  .option('-r, --root <path>', 'Workspace directory to scan', '.')
  .option('-k, --top-k <number>', 'Maximum matching code blocks to return', '5')
  .action(async (query, options) => {
    try {
      const rootPath = path.resolve(options.root);
      const topK = parseInt(options.topK, 10);

      logger.info(`Scanning codebase recursively in: ${pc.cyan(rootPath)}...`);
      const files = await fileSystem.getFilesRecursively(rootPath);

      logger.info(`Indexing and matching query: "${pc.cyan(query)}"...`);
      const searchService = new SemanticSearchService();
      const matches = searchService.search(files, query, topK);

      if (matches.length === 0) {
        logger.warn(`No relevant snippets matched query: "${query}"`);
        return;
      }

      console.log('\n' + pc.bold(pc.green(`=================== LOCAL SEMANTIC MATCHES (Top ${matches.length}) ===================`)));
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const absPath = path.resolve(rootPath, match.relativePath);
        console.log(`\n${pc.bold(`${i + 1}. [${match.relativePath}]`)} - Score: ${pc.yellow(match.score)}`);
        console.log(pc.dim(`  file:///${absPath.replace(/\\/g, '/')}#L${match.startLine}-L${match.endLine}`));
        console.log(pc.gray('  --------------------------------------------------'));
        const snippetLines = match.snippet.split('\n');
        for (const line of snippetLines) {
          console.log(`  ${line}`);
        }
        console.log(pc.gray('  --------------------------------------------------'));
      }
      console.log('\n' + pc.bold(pc.green('===============================================================================\n')));

    } catch (err: any) {
      logger.error(`Semantic search failed: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
