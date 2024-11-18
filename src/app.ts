import { config } from '@users/config';
import { database } from '@users/database';
import { UsersServer } from '@users/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    config.cloudinaryConfig();
    database.connection();

    const app: Express = express();
    const server = new UsersServer(app);

    server.start();
  }
}

const application = new Application();
application.initialize();
