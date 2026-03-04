import { HealthStatusEntity } from './HealthStatus.model';

export interface IHealthRepository {
  getHealthStatus(requestId: string): Promise<HealthStatusEntity>;
}

export class HealthRepository implements IHealthRepository {
  public async getHealthStatus(requestId: string): Promise<HealthStatusEntity> {
    return new HealthStatusEntity('ok', requestId);
  }
}
