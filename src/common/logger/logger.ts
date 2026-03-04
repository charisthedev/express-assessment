import pino from 'pino';
import { env } from '../../config/env';
import { ILogger } from './ILogger';

const isDevelopment = env.nodeEnv === 'development';

export const nativeLogger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
    : undefined,
  base: {
    service: 'notes-task-app'
  }
});

class PinoLogger implements ILogger {
  constructor(private readonly pinoLogger: pino.Logger) { }

  public debug(payload: unknown, message?: string): void {
    this.log('debug', payload, message);
  }

  public info(payload: unknown, message?: string): void {
    this.log('info', payload, message);
  }

  public warn(payload: unknown, message?: string): void {
    this.log('warn', payload, message);
  }

  public error(payload: unknown, message?: string): void {
    this.log('error', payload, message);
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', payload: unknown, message?: string): void {
    if (message) {
      this.pinoLogger[level](payload, message);
      return;
    }

    this.pinoLogger[level](payload);
  }
}

export const logger: ILogger = new PinoLogger(nativeLogger);
