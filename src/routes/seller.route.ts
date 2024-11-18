import { createSellerController } from '@users/controllers/seller/create';
import { getSellerController } from '@users/controllers/seller/get';
import { seedController } from '@users/controllers/seller/seed';
import { updateSellerController } from '@users/controllers/seller/update';
import express, { Router } from 'express';

class SellerRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/id/:sellerId', getSellerController.id);
    this.router.get('/random/:size', getSellerController.random);
    this.router.post('/create', createSellerController.createSeller);
    this.router.put('/:sellerId', updateSellerController.updateSeller);
    this.router.put('/seed/:count', seedController.createSeedData);
    return this.router;
  }
}

export const sellerRoutes = new SellerRoutes();
