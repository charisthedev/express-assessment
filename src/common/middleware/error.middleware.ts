import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { ILogger } from '../logger/ILogger';
import { logger } from '../logger/logger';

export class ErrorMiddleware {
  constructor(private readonly appLogger: ILogger = logger) {}

  public handle = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    const requestId = req.requestId;

    if (err instanceof AppError) {
      this.appLogger.warn({ err, requestId }, 'Handled application error');
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        details: err.details,
        requestId
      });
      return;
    }

    this.appLogger.error({ err, requestId }, 'Unhandled error');

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      requestId
    });
  };
}
