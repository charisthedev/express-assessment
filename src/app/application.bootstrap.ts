import { DataSource } from 'typeorm';
import { ILogger } from '../common/logger/ILogger';
import { logger } from '../common/logger/logger';
import { AppDataSource } from '../database/data-source';
import { HttpServer } from './http.server';

export class ApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly httpServer: HttpServer = new HttpServer(),
    private readonly appLogger: ILogger = logger
  ) {}

  public async run(port: number): Promise<void> {
    await this.dataSource.initialize();
    this.appLogger.info('Database connection initialized');
    await this.httpServer.start(port);
  }
}
