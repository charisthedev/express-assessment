import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export class RequestIdMiddleware {
  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const incomingRequestId = req.header('x-request-id');
    const requestId = incomingRequestId ?? randomUUID();

    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    next();
  };
}
