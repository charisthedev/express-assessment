import http from 'node:http';
import { App } from './app';
import { ILogger } from '../common/logger/ILogger';
import { logger } from '../common/logger/logger';

export class HttpServer {
  constructor(
    private readonly app: App = new App(),
    private readonly appLogger: ILogger = logger
  ) {}

  public async start(port: number): Promise<http.Server> {
    const expressApp = this.app.create();

    return new Promise((resolve) => {
      const server = expressApp.listen(port, () => {
        this.appLogger.info({ port }, 'HTTP server started');
        resolve(server);
      });
    });
  }
}
