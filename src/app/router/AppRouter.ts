import { Router } from 'express';
import { healthRouter } from '../health/router';
import { noteRouter } from '../note/router';

export class AppRouter {
  public build(): Router {
    const router = Router();
    router.use(healthRouter);
    router.use(noteRouter);

    return router;
  }
}
