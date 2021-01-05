import * as restify from 'restify';

import { Router } from '../common/routes';
import { User } from '../users/users.model';
import { NotFoundError } from 'restify-errors';

class UserRouter extends Router {
  applyRouters(application: restify.Server) {
    application.get('/users', (req, resp, next) => {
      User.find().then(users => {
        resp.json(users);
        return next();
      });
    });

    application.get('/users/:id', (req, resp, next) => {
      User.findById(req.params.id)
        .then(this.render(resp,next))
        .catch(next);
    });

    application.post('/users', (req, resp, next) => {
      let user = new User(req.body);
      user.save().then(this.render(resp,next))
      .catch(next);
    });

    application.put('/users/:id', (req, resp, next) => {
      const options = { runValidators: true, overwrite: true };
      (<any>User).update({ _id: req.params.id }, req.body, options)
        .exec().then(result => {
          if (result.n) {
            return User.findById(req.params.id);
          } else {
            throw new NotFoundError('Document not found.');
          }
        }).then(this.render(resp,next))
          .catch(next);
    });

    application.patch('/users/:id', (req, resp, next) => {
      const options = { runValidators: true, new: true };
      User.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(resp,next))
        .catch(next);
    });

    application.del('/users/:id', (req, resp, next) => {
      User.remove({ _id: req.params.id }).exec().then((cmdResult: any) => {
        if (cmdResult.result.n) {
          resp.send(204)
        } else {
          throw new NotFoundError('Document not found.');
        }

        return next();
      }).catch(next);
    });
  }
}

export const userRouter = new UserRouter();
