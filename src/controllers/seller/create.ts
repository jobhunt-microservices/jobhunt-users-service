import { BadRequestError, ISellerDocument } from '@jobhunt-microservices/jobhunt-shared';
import { sellerSchema } from '@users/schemes/seller.scheme';
import { sellerService } from '@users/services/seller.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class CreateSellerController {
  createSeller = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(sellerSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Create seller() method error');
    }
    const checkIfSellerExist: ISellerDocument | null = await sellerService.getSellerByEmail(req.body.email);
    if (checkIfSellerExist) {
      throw new BadRequestError('Seller already exist. Go to your account page to update.', 'Create seller() method error');
    }
    const seller: ISellerDocument = {
      profilePublicId: req.body.profilePublicId,
      fullName: req.body.fullName,
      username: req.currentUser!.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      description: req.body.description,
      oneliner: req.body.oneliner,
      skills: req.body.skills,
      languages: req.body.languages,
      responseTime: req.body.responseTime,
      experience: req.body.experience,
      education: req.body.education,
      socialLinks: req.body.socialLinks,
      certificates: req.body.certificates
    };
    const createdSeller: ISellerDocument = await sellerService.createSeller(seller);
    res.status(StatusCodes.CREATED).json({ message: 'Seller created successfully.', seller: createdSeller });
  };
}

export const createSellerController = new CreateSellerController();
