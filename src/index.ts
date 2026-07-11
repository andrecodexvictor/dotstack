export { RecommendationService } from './core/services/recommendation.service.js';
export * from './core/models/brief.js';
export * from './core/models/recommendation.js';
export * from './core/rules/index.js';
export { getPatternsForStack } from './core/registry/patterns.js';
export { FileSystemPort } from './core/ports/file-system.port.js';
export { LoggerPort } from './core/ports/logger.port.js';
export { NodeFileSystemAdapter } from './adapters/fs/node-fs.adapter.js';
export { ConsoleLoggerAdapter } from './adapters/logger/console-logger.adapter.js';
