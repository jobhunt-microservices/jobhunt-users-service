import { getBuyerController } from '@users/controllers/buyer/get';
import express, { Router } from 'express';

class BuyerRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/email', getBuyerController.email);
    this.router.get('/username', getBuyerController.currentUsername);
    this.router.get('/:username', getBuyerController.username);
    return this.router;
  }
}

export const buyerRoutes = new BuyerRoutes();
