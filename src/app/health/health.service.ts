import { HealthStatusEntity } from './HealthStatus.model';
import { ILogger } from '../../common/logger/ILogger';
import { logger } from '../../common/logger/logger';
import { HealthRepository, IHealthRepository } from './health.repository';

export class HealthService {
  constructor(
    private readonly healthRepository: IHealthRepository = new HealthRepository(),
    private readonly appLogger: ILogger = logger
  ) { }

  public async getStatus(requestId: string): Promise<HealthStatusEntity> {
    this.appLogger.debug({ requestId }, 'Fetching health status');
    return this.healthRepository.getHealthStatus(requestId);
  }
}
