import { ISellerDocument } from '@jobhunt-microservices/jobhunt-shared';
import { sellerService } from '@users/services/seller.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class GetSellerController {
  id = async (req: Request, res: Response): Promise<void> => {
    const seller: ISellerDocument | null = await sellerService.getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
  };

  username = async (req: Request, res: Response): Promise<void> => {
    const seller: ISellerDocument | null = await sellerService.getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
  };

  random = async (req: Request, res: Response): Promise<void> => {
    const sellers: ISellerDocument[] = await sellerService.getRandomSellers(parseInt(req.params.size, 10));
    res.status(StatusCodes.OK).json({ message: 'Random sellers profile', sellers });
  };
}

export const getSellerController = new GetSellerController();
