import * as jestCli from 'jest-cli';

import { Server } from './server/server'
import { environment } from './common/environment'
import { userRouter } from './users/users.router'
import { User } from './users/users.model'
import { Review } from './reviews/reviews.model';
import { reviewsRouter } from './reviews/reviews.router';
import { restaurantsRouter } from './restaurants/restaurant.router';
import { Restaurant } from './restaurants/restaurants.model';

let server: Server;

const beforeAllTest = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server.bootstrap([
    userRouter,
    reviewsRouter,
    restaurantsRouter
  ])
    .then(() => User.remove({}).exec())
    .then(() => {
      let admin = new User();
      admin.name = 'admin',
      admin.email = 'admin@gmail.com',
      admin.password = '123456',
      admin.profiles = ['admin', 'user']
      return admin.save()
    })
    .then(() => Review.remove({}).exec())
    .then(() => Restaurant.remove({}).exec())
};

const afterAllTest = () => {
  return server.shutdown();
};

beforeAllTest()
  .then(() => jestCli.run())
  .then(() => afterAllTest())
  .catch(console.error)
