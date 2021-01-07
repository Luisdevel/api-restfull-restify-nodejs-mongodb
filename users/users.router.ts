import * as restify from 'restify';

import { ModelRouter } from '../common/model-router';
import { User } from '../users/users.model';
import { BadRequestError } from 'restify-errors';

class UserRouter extends ModelRouter<User> {
  constructor() {
    super(User);
    this.on('beforeRender', document => {
      document.password = undefined;
    });
  };

  findByEmail = (req, resp, next) => {
      if (req.query.email) {
        User.find({ email: req.query.email })
          .then(this.renderAll(resp, next))
          .catch(next);
      } else {
        next();
      };
  };

  applyRouters(application: restify.Server) {
    application.get('/users', restify.plugins.conditionalHandler([
      { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
      { version: '1.0.0', handler: this.findAll },
    ]));
    application.get('/users/:id', [ this.validateId, this.findById ]);
    application.post('/users', [ this.validateId, this.save ]);
    application.put('/users/:id', [ this.validateId, this.replace ]);
    application.patch('/users/:id', [ this.validateId, this.update ]);
    application.del('/users/:id', [ this.validateId, this.delete ]);
  }
}

export const userRouter = new UserRouter();
