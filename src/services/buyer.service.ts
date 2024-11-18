import { IBuyerDocument } from '@jobhunt-microservices/jobhunt-shared';
import { BuyerModel } from '@users/models/buyer.schema';

class BuyerService {
  getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ email }).exec()) as IBuyerDocument;
    return buyer;
  };
  getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ username }).exec()) as IBuyerDocument;
    return buyer;
  };
  getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
    const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
    return buyers;
  };
  createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
    const checkIfBuyerExist: IBuyerDocument | null = await this.getBuyerByEmail(`${buyerData.email}`);
    if (!checkIfBuyerExist) {
      await BuyerModel.create(buyerData);
    }
  };
  updateBuyerIsSellerProp = async (email: string): Promise<void> => {
    await BuyerModel.updateOne(
      { email },
      {
        $set: {
          isSeller: true
        }
      }
    ).exec();
  };
  updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
    await BuyerModel.updateOne(
      { _id: buyerId },
      type === 'purchased-gigs'
        ? {
            $push: {
              purchasedGigs: purchasedGigId
            }
          }
        : {
            $pull: {
              purchasedGigs: purchasedGigId
            }
          }
    ).exec();
  };
}

export const buyerService = new BuyerService();
