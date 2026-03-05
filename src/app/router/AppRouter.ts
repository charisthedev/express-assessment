import { Router } from 'express';
import { healthRouter } from '../health/router';
import { noteRouter } from '../note/router';

export const API_BASE_PATH = '/api';

export class AppRouter {
  public build(): Router {
    const router = Router();
    const apiRouter = Router();
    apiRouter.use(healthRouter);
    apiRouter.use(noteRouter);

    router.use(API_BASE_PATH, apiRouter);

    return router;
  }
}
