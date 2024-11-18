import {
  ExchangeNames,
  getErrorMessage,
  IBuyerDocument,
  ISellerDocument,
  QueueNames,
  RoutingKeys
} from '@jobhunt-microservices/jobhunt-shared';
import { SERVICE_NAME } from '@users/constants';
import { createConnection } from '@users/queues/connections';
import { userProducer } from '@users/queues/producers/user.producer';
import { buyerService } from '@users/services/buyer.service';
import { sellerService } from '@users/services/seller.service';
import { logger } from '@users/utils/logger.util';
import { Channel, ConsumeMessage, Replies } from 'amqplib';

const log = logger('usersUserConsumer', 'debug');

class UserConsumer {
  consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.BUY_CREATED, 'direct');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(QueueNames.BUYER_CREATED, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, ExchangeNames.BUY_CREATED, RoutingKeys.BUYER_CREATED);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type } = JSON.parse(msg!.content.toString());
        if (type === 'auth') {
          const { username, email, profilePicture, createdAt } = JSON.parse(msg!.content.toString());
          const buyer: IBuyerDocument = {
            username,
            email,
            profilePicture,
            purchasedGigs: [],
            createdAt
          };
          await buyerService.createBuyer(buyer);
        } else {
          const { buyerId, purchasedGigs } = JSON.parse(msg!.content.toString());
          await buyerService.updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' UserConsumer consumeBuyerDirectMessage() method error:', getErrorMessage(error));
    }
  };

  consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.SELL_CREATED, 'direct');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(QueueNames.SELLER_CREATED, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, ExchangeNames.SELL_CREATED, RoutingKeys.SELLER_CREATED);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
          msg!.content.toString()
        );
        if (type === 'create-order') {
          await sellerService.updateSellerOngoingJobsProp(sellerId, ongoingJobs);
        } else if (type === 'approve-order') {
          await sellerService.updateSellerCompletedJobsProp({
            sellerId,
            ongoingJobs,
            completedJobs,
            totalEarnings,
            recentDelivery
          });
        } else if (type === 'update-gig-count') {
          await sellerService.updateTotalGigsCount(`${gigSellerId}`, count);
        } else if (type === 'cancel-order') {
          await sellerService.updateSellerCancelledJobsProp(sellerId);
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' UserConsumer consumeSellerDirectMessage() method error:', getErrorMessage(error));
    }
  };

  consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.SELLER_REVIEW, 'fanout');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(QueueNames.SELLER_REVIEW, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, ExchangeNames.SELLER_REVIEW, '');
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type } = JSON.parse(msg!.content.toString());
        if (type === 'buyer-review') {
          await sellerService.updateSellerReview(JSON.parse(msg!.content.toString()));
          await userProducer.publishDirectMessage(
            channel,
            ExchangeNames.UPDATE_GIG,
            RoutingKeys.UPDATE_GIG,
            JSON.stringify({ type: 'updateGig', gigReview: msg!.content.toString() }),
            'Message sent to gig service.'
          );
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' UserConsumer consumeReviewFanoutMessages() method error:', getErrorMessage(error));
    }
  };

  consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }

      await channel.assertExchange(ExchangeNames.GIG, 'direct');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(QueueNames.USERS_GIG, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, ExchangeNames.GIG, RoutingKeys.GET_SELLERS);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { type } = JSON.parse(msg!.content.toString());
        if (type === 'getSellers') {
          const { count } = JSON.parse(msg!.content.toString());
          const sellers: ISellerDocument[] = await sellerService.getRandomSellers(parseInt(count, 10));
          await userProducer.publishDirectMessage(
            channel,
            ExchangeNames.SEED_GIG,
            RoutingKeys.RECEIVE_SELLERS,
            JSON.stringify({ type: 'receiveSellers', sellers, count }),
            'Message sent to gig service.'
          );
        }
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' UserConsumer consumeReviewFanoutMessages() method error:', getErrorMessage(error));
    }
  };
}

export const userConsumer = new UserConsumer();
