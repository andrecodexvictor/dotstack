import { LoggerPort } from '../../core/ports/logger.port.js';
import pc from 'picocolors';

export class ConsoleLoggerAdapter implements LoggerPort {
  info(message: string): void {
    console.log(pc.blue('ℹ info') + ': ' + message);
  }

  warn(message: string): void {
    console.warn(pc.yellow('⚠ warning') + ': ' + message);
  }

  error(message: string): void {
    console.error(pc.red('✖ error') + ': ' + message);
  }

  success(message: string): void {
    console.log(pc.green('✔ success') + ': ' + message);
  }
}
