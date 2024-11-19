import { healthRoutes } from '@users/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes.routes());
};

export { appRoutes };
