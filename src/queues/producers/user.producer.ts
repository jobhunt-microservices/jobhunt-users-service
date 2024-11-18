import { SERVICE_NAME } from '@users/constants';
import { logger } from '@users/utils/logger.util';
import { Channel } from 'amqplib';
import { createConnection } from '../connections';

const log = logger('usersUserProducer', 'debug');

class UserProducer {
  publishDirectMessage = async (
    channel: Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    logMessage: string
  ): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(exchangeName, 'direct');
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      log.info(logMessage);
    } catch (error) {
      log.log('error', SERVICE_NAME + ' publishDirectMessage() method error:', error);
    }
  };
}

export const userProducer = new UserProducer();
