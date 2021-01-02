import * as restify from 'restify';

import { Router } from '../common/routes';
import { User } from '../users/users.model';

class UserRouter extends Router {
  applyRouters(application: restify.Server) {
    application.get('/users', (req, resp, next) => {
      User.find().then(users => {
        resp.json(users);
        return next();
      });
    });

    application.get('/users/:id', (req, resp, next) => {
      User.findById(req.params.id).then(user => {
        if (user) {
          resp.json(user);
          return next();
        }

        resp.json(400);
        return next();
      });
    });

    application.post('/users', (req, resp, next) => {
      let user = new User(req.body);
      user.save().then(user => {
        user.password = undefined;
        resp.json(user);
        return next();
      });
    });
  }
}

export const userRouter = new UserRouter();
