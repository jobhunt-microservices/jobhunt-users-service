import { healthController } from '@users/controllers/health.controller';
import express, { Router } from 'express';

class HealthRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/user-health', healthController.health);
    return this.router;
  }
}

export const healthRoutes = new HealthRoutes();
