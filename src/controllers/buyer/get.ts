import { IBuyerDocument } from '@jobhunt-microservices/jobhunt-shared';
import { buyerService } from '@users/services/buyer.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class GetBuyerController {
  email = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByEmail(req.currentUser!.email);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  };

  currentUsername = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByUsername(req.currentUser!.username);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  };

  username = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  };
}

export const getBuyerController = new GetBuyerController();
