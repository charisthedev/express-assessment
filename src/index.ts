import { logger } from './common/logger/logger';
import { ApplicationBootstrap } from './app/application.bootstrap';
import { env } from './config/env';

const bootstrapper = new ApplicationBootstrap();

const bootstrap = async (): Promise<void> => {
  try {
    await bootstrapper.run(env.port);
  } catch (error) {
    logger.error({ err: error }, 'Failed to bootstrap application');
    process.exit(1);
  }
};

void bootstrap();
