import { IBuyerDocument } from '@jobhunt-microservices/jobhunt-shared';
import mongoose, { Model, Schema, model } from 'mongoose';

const buyerSchema: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: false },
    profilePublicId: { type: String, required: false },
    isSeller: { type: Boolean, default: false },
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);

const BuyerModel: Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };