import { AppRouter } from './AppRouter';

const appRouter = new AppRouter();

export const router = appRouter.build();
