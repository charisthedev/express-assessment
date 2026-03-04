import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express, { Express } from 'express';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { nativeLogger } from '../common/logger/logger';
import { ErrorMiddleware } from '../common/middleware/error.middleware';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { swaggerSpec } from '../common/swagger/swagger';
import { router } from './router';

export class App {
  private readonly errorMiddleware = new ErrorMiddleware();
  private readonly requestIdMiddleware = new RequestIdMiddleware();

  public create(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(this.requestIdMiddleware.handle);

    app.use(
      pinoHttp({
        logger: nativeLogger,
        genReqId: (req, res) => {
          const headerRequestId = req.headers['x-request-id'];
          const requestId =
            (typeof headerRequestId === 'string' && headerRequestId) ||
            (Array.isArray(headerRequestId) ? headerRequestId[0] : undefined) ||
            randomUUID();

          req.requestId = requestId;
          res.setHeader('x-request-id', requestId);

          return requestId;
        },
        customProps: (req) => ({
          requestId: req.id
        })
      })
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(router);
    app.use(this.errorMiddleware.handle);

    return app;
  }
}
