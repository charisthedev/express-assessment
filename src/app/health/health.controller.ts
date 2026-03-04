import { Request, Response } from 'express';
import { HealthService } from './health.service';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  public check = async (req: Request, res: Response): Promise<void> => {
    const response = await this.healthService.getStatus(req.requestId);
    res.status(200).json(response);
  };
}
