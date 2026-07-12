export { RecommendationService } from './core/services/recommendation.service.js';
export * from './core/models/brief.js';
export * from './core/models/recommendation.js';
export * from './core/rules/index.js';
export { getPatternsForStack } from './core/registry/patterns.js';
export { FileSystemPort } from './core/ports/file-system.port.js';
export { LoggerPort } from './core/ports/logger.port.js';
export { NodeFileSystemAdapter } from './adapters/fs/node-fs.adapter.js';
export { ConsoleLoggerAdapter } from './adapters/logger/console-logger.adapter.js';
export { SemanticSearchService } from './core/services/semantic-search.service.js';
export { startMcpServer } from './adapters/mcp/mcp.adapter.js';
export { installMcpServer } from './adapters/cli/mcp-installer.js';
export { AuditEngine } from './core/audit/index.js';
export { MigrationPlanner } from './core/migrate/index.js';
export * from './core/report/index.js';

