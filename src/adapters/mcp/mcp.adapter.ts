import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { RecommendationService } from '../../core/services/recommendation.service.js';
import { NodeFileSystemAdapter } from '../fs/node-fs.adapter.js';
import { SemanticSearchService } from '../../core/services/semantic-search.service.js';
import { AuditEngine } from '../../core/audit/index.js';
import { MigrationPlanner } from '../../core/migrate/index.js';
import { generateMarkdownReport } from '../../core/report/index.js';
import { ProjectBrief } from '../../core/models/brief.js';
import path from 'path';
import fs from 'fs/promises';

const server = new Server(
  {
    name: 'dotstack-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const recommendationService = new RecommendationService();
const fileSystem = new NodeFileSystemAdapter();
const searchService = new SemanticSearchService();

// 1. Define list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'dotstack_init',
        description: 'Initialize a standard dotstack-project.yaml brief template inside the project root.',
        inputSchema: {
          type: 'object',
          properties: {
            projectRoot: {
              type: 'string',
              description: 'Absolute path to project directory. Defaults to current directory.'
            }
          }
        }
      },
      {
        name: 'dotstack_recommend',
        description: 'Analyze a project parameter configuration (Project Brief) and return stack recommendations and rationales.',
        inputSchema: {
          type: 'object',
          properties: {
            brief: {
              type: 'object',
              description: 'The raw brief parameters object containing product, team, requirements, and constraints.',
              required: ['product', 'team', 'requirements'],
              properties: {
                product: {
                  type: 'object',
                  required: ['name', 'type'],
                  properties: {
                    name: { type: 'string' },
                    type: {
                      type: 'string',
                      enum: ['SaaS', 'API', 'MobileApp', 'CLI', 'InternalTool', 'WebApp']
                    }
                  }
                },
                team: {
                  type: 'object',
                  required: ['devs', 'experience'],
                  properties: {
                    devs: { type: 'integer', minimum: 1 },
                    experience: { type: 'string', enum: ['junior', 'intermediate', 'senior'] }
                  }
                },
                requirements: {
                  type: 'object',
                  required: ['scale'],
                  properties: {
                    scale: { type: 'string', enum: ['low', 'medium', 'high'] },
                    latency: { type: 'string', enum: ['normal', 'low-latency'], default: 'normal' },
                    availability: { type: 'string', enum: ['normal', 'high-availability'], default: 'normal' }
                  }
                },
                constraints: {
                  type: 'object',
                  properties: {
                    language: { type: 'string', enum: ['TypeScript', 'Python', 'Go', 'Java'] },
                    database: { type: 'string', enum: ['PostgreSQL', 'MongoDB', 'SQLite', 'Redis'] },
                    cloud: { type: 'string', enum: ['AWS', 'Vercel', 'Render', 'Docker'] },
                    budget: { type: 'number' }
                  }
                }
              }
            },
            projectRoot: {
              type: 'string',
              description: 'Absolute path to project root folder to write stack.yaml and README.md. Defaults to current directory.'
            }
          },
          required: ['brief']
        }
      },
      {
        name: 'dotstack_patterns',
        description: 'Resolve design patterns and references for a recommended tech stack.',
        inputSchema: {
          type: 'object',
          required: ['backend', 'database', 'architectureStyle'],
          properties: {
            backend: { type: 'string', description: 'Recommended backend language/framework (e.g. TypeScript (NestJS))' },
            database: { type: 'string', description: 'Recommended database system (e.g. PostgreSQL)' },
            architectureStyle: { type: 'string', description: 'Recommended architecture style (e.g. Monolith)' }
          }
        }
      },
      {
        name: 'dotstack_semantic_search',
        description: 'Perform local vector-space semantic search across the codebase. Tokenizes, TF-IDF indexes, and ranks file chunks by Cosine Similarity.',
        inputSchema: {
          type: 'object',
          required: ['query'],
          properties: {
            query: { type: 'string', description: 'The search query string (e.g. "database connection", "cli command options")' },
            projectRoot: { type: 'string', description: 'Absolute path to codebase root directory. Defaults to current directory.' },
            topK: { type: 'integer', description: 'Maximum number of ranked matching snippets to return. Defaults to 5.', default: 5 }
          }
        }
      },
      {
        name: 'dotstack_audit',
        description: 'Scan workspace dependencies and configuration files, then compare actual technologies against the recommended stack.',
        inputSchema: {
          type: 'object',
          properties: {
            projectRoot: { type: 'string', description: 'Absolute path to codebase root directory. Defaults to current directory.' }
          }
        }
      },
      {
        name: 'dotstack_migrate',
        description: 'Generate a step-by-step migration blueprint from a current stack configuration to a target stack.',
        inputSchema: {
          type: 'object',
          required: ['currentStack', 'targetStack'],
          properties: {
            currentStack: {
              type: 'object',
              description: 'Key-value map of current technologies (e.g. backend, database, frontend)',
              properties: {
                frontend: { type: 'string' },
                backend: { type: 'string' },
                database: { type: 'string' }
              }
            },
            targetStack: {
              type: 'object',
              description: 'Key-value map of target technologies (e.g. backend, database, frontend)',
              properties: {
                frontend: { type: 'string' },
                backend: { type: 'string' },
                database: { type: 'string' }
              }
            }
          }
        }
      },
      {
        name: 'dotstack_docs',
        description: 'Compile an Architecture Decision Record (ADR) report from a project brief configuration.',
        inputSchema: {
          type: 'object',
          required: ['brief'],
          properties: {
            brief: {
              type: 'object',
              description: 'The raw brief parameters object containing product, team, requirements, and constraints.'
            }
          }
        }
      }
    ]
  };
});

// 2. Handle tool execution calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const projectRoot = path.resolve((args?.projectRoot as string) || '.');

  try {
    switch (name) {
      case 'dotstack_init': {
        const templateContent = `# dotstack-project.yaml
product:
  name: "My App"
  type: "SaaS"

team:
  devs: 3
  experience: "intermediate"

requirements:
  scale: "medium"
  latency: "normal"
  availability: "normal"

constraints: {}
`;
        const outputPath = path.join(projectRoot, 'dotstack-project.yaml');
        await fs.mkdir(projectRoot, { recursive: true });
        await fs.writeFile(outputPath, templateContent, 'utf8');

        return {
          content: [
            {
              type: 'text',
              text: `Successfully initialized template project brief config at: ${outputPath}\nEdit this file and run recommendations to establish stack rules.`
            }
          ]
        };
      }

      case 'dotstack_recommend': {
        const brief = args?.brief;
        if (!brief) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing parameter: brief');
        }

        const recommendation = recommendationService.recommend(brief);
        
        // Write outputs using Node FS Adapter
        const { yamlPath, mdPath } = await fileSystem.writeOutputs(recommendation, projectRoot);

        return {
          content: [
            {
              type: 'text',
              text: `### Recommendation Analysis Complete\n\n` +
                    `Saved stack outputs to:\n` +
                    `- YAML: ${yamlPath}\n` +
                    `- Markdown: ${mdPath}\n\n` +
                    `#### Recommendation:\n` +
                    `- **ArchitectureStyle**: ${recommendation.recommendation.architectureStyle}\n` +
                    `- **Frontend**: ${recommendation.recommendation.frontend}\n` +
                    `- **Backend**: ${recommendation.recommendation.backend}\n` +
                    `- **Database**: ${recommendation.recommendation.database}\n` +
                    (recommendation.recommendation.cache ? `- **Cache**: ${recommendation.recommendation.cache}\n` : '') +
                    `- **Deployment**: ${recommendation.recommendation.deployment}\n`
            }
          ]
        };
      }

      case 'dotstack_patterns': {
        const backend = args?.backend as string;
        const database = args?.database as string;
        const architectureStyle = args?.architectureStyle as string;

        if (!backend || !database || !architectureStyle) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing parameters: backend, database, or architectureStyle are required.');
        }

        const { getPatternsForStack } = await import('../../core/registry/patterns.js');
        const patterns = getPatternsForStack(backend, database, architectureStyle);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(patterns, null, 2)
            }
          ]
        };
      }

      case 'dotstack_semantic_search': {
        const query = args?.query as string;
        const topK = (args?.topK as number) || 5;

        if (!query) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing parameter: query');
        }

        // 1. Read files recursively
        const projectFiles = await fileSystem.getFilesRecursively(projectRoot);

        // 2. Perform TF-IDF semantic search
        const matches = searchService.search(projectFiles, query, topK);

        if (matches.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No matching code snippets found for query: "${query}"`
              }
            ]
          };
        }

        // 3. Format outputs as text block report
        let report = `### Semantic Search Results (top ${topK} matches for: "${query}")\n\n`;
        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];
          report += `#### ${i + 1}. [${match.relativePath}](file:///${path.resolve(projectRoot, match.relativePath).replace(/\\/g, '/')}#L${match.startLine}-L${match.endLine}) (Score: ${match.score})\n`;
          report += `Lines ${match.startLine}-${match.endLine}:\n`;
          report += '```' + (path.extname(match.relativePath).substring(1) || 'text') + '\n';
          report += match.snippet + '\n';
          report += '```\n\n';
        }

        return {
          content: [
            {
              type: 'text',
              text: report
            }
          ]
        };
      }

      case 'dotstack_audit': {
        const auditEngine = new AuditEngine();
        let brief;
        try {
          brief = await fileSystem.readBrief(path.join(projectRoot, 'dotstack-project.yaml'));
        } catch {
          brief = {
            product: { name: 'Audited App', type: 'SaaS' },
            team: { devs: 3, experience: 'intermediate' },
            requirements: { scale: 'medium' },
            constraints: {}
          };
        }
        const recommendation = recommendationService.recommend(brief);
        const auditResult = await auditEngine.audit(projectRoot, recommendation);
        return {
          content: [
            {
              type: 'text',
              text: `### Stack Audit Alignment: ${auditResult.alignmentScore}%\n\n` +
                    `#### Detected Stack:\n${JSON.stringify(auditResult.detected, null, 2)}\n\n` +
                    `#### Divergences (${auditResult.divergences.length}):\n` +
                    (auditResult.divergences.length > 0 
                      ? auditResult.divergences.map(d => `- **[${d.severity.toUpperCase()}] ${d.category}**: ${d.details} (Recommended: ${d.recommended})`).join('\n')
                      : 'None! Stack is perfectly aligned.')
            }
          ]
        };
      }

      case 'dotstack_migrate': {
        const currentStack = args?.currentStack as Record<string, string>;
        const targetStack = args?.targetStack as Record<string, string>;
        if (!currentStack || !targetStack) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing parameters: currentStack or targetStack');
        }
        const planner = new MigrationPlanner();
        const migrationPlan = planner.plan(currentStack, targetStack);
        return {
          content: [
            {
              type: 'text',
              text: `### Phased Migration Blueprint\n\n` +
                    `- **Estimated Duration**: ${migrationPlan.totalEstimatedWeeks} week(s)\n` +
                    `- **Overall Risk**: ${migrationPlan.overallRisk.toUpperCase()}\n\n` +
                    (migrationPlan.phases.length > 0
                      ? migrationPlan.phases.map(p => 
                          `#### ${p.name}\n_${p.description}_\n` +
                          p.tasks.map(t => `- [ ] **${t.title}** (Effort: ${t.effort}, ${t.estimatedHours}h)\n  _${t.description}_`).join('\n')
                        ).join('\n\n')
                      : 'No migration tasks needed. Stack configs match.')
            }
          ]
        };
      }

      case 'dotstack_docs': {
        const brief = args?.brief as ProjectBrief;
        if (!brief) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing parameter: brief');
        }
        const recommendation = recommendationService.recommend(brief);
        const mdReport = generateMarkdownReport(recommendation, brief, false);
        return {
          content: [
            {
              type: 'text',
              text: mdReport
            }
          ]
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `MCP Server Tool Call Error: ${error.message}`
        }
      ]
    };
  }
});

// 3. Start Stdio transport server
export async function startMcpServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log message to stderr since stdout is reserved for MCP JSON-RPC protocol messages!
  console.error('dotstack MCP server running on stdio transport.');
}
