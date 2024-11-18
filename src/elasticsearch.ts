import { Client } from '@elastic/elasticsearch';
import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';
import { config } from '@users/config';
import { SERVICE_NAME } from '@users/constants';
import { logger } from '@users/utils/logger.util';

const log = logger('usersElasticSearchConnection', 'debug');

class ElasticSearch {
  public elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      try {
        const health = await this.elasticSearchClient.cluster.health({});
        log.info(SERVICE_NAME + ` elasticsearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error(SERVICE_NAME + ' connection to elasticsearch failed, retrying');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        log.log('error', SERVICE_NAME + ' checkConnection() method:', getErrorMessage(error));
      }
    }
  }
}

export const elasticSearch = new ElasticSearch();
