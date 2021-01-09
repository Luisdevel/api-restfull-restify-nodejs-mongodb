import * as jestCli from 'jest-cli';

import { Server } from './server/server'
import { environment } from './common/environment'
import { userRouter } from './users/users.router'
import { User } from './users/users.model'
import { Review } from './reviews/reviews.model';
import { reviewsRouter } from './reviews/reviews.router';

let server: Server;

const beforeAllTest = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server.bootstrap([
    userRouter,
    reviewsRouter
  ])
    .then(() => User.remove({}).exec())
    .then(() => Review.remove({}).exec())
};

const afterAllTest = () => {
  return server.shutdown();
};

beforeAllTest()
  .then(() => jestCli.run())
  .then(() => afterAllTest())
  .catch(console.error)
