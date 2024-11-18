import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import { config } from '@users/config';
import { SERVICE_NAME } from '@users/constants';
import { logger } from '@users/utils/logger.util';
import mongoose from 'mongoose';

const log = logger('usersDatabaseServer', 'debug');

export class Database {
  async connection() {
    try {
      await mongoose.connect(`${config.DATABASE_URL}`);
      log.info(SERVICE_NAME + ' Mongodb database connection has been established successfully');
    } catch (error) {
      console.log(error);
      log.error(SERVICE_NAME + ' unable to connect to db');
      log.log('error', SERVICE_NAME + ` connection() method:`, getErrorMessage(error));
    }
  }
}

export const database = new Database();
