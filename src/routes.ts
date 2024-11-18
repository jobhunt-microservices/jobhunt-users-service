import { verifyGatewayRequest } from '@jobhunt-microservices/jobhunt-shared';
import { BUYER_BASE_PATH, SELLER_BASE_PATH } from '@users/constants/path';
import { buyerRoutes } from '@users/routes/buyer.route';
import { healthRoutes } from '@users/routes/health.route';
import { sellerRoutes } from '@users/routes/seller.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(SELLER_BASE_PATH, healthRoutes.routes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes.routes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes.routes());
};

export { appRoutes };
