import * as restify from 'restify';
import * as mongoose from 'mongoose';
import * as fs from 'fs';

import { environment } from '../common/environment';
import { Router } from '../common/routes';
import {mergePatchBodyParser} from './merge-patch.parser';
import { handleError } from './error.handler';
import { tokenParser } from '../security/token.parser';
import { logger } from '../common/logger';

export class Server {
  application: restify.Server;

  initializeDb(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, {
      useMongoClient: true,
    });
  };

  initRouter(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const options: restify.ServerOptions = {
          name: 'meat_api_teste',
          version: '1.0.0',
          log: logger
        }
        if (environment.security.enableHTTPS) {
          options.certificate = fs.readFileSync(environment.security.certificate),
          options.key = fs.readFileSync(environment.security.key)
        }
        //server
        this.application = restify.createServer(options);

        this.application.pre(restify.plugins.requestLogger({
          log: logger
        }));

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        //routes
        for (let router of routers) {
          router.applyRouters(this.application);
        }

        this.application.listen(environment.server.port, () => {
          return resolve(this.application);
        });

        this.application.on('restifyError', handleError);
        // Logger
        /* this.application.on('after', restify.plugins.auditLogger({
          log: logger,
          event: 'after',
        })); */

      } catch (error) {
        return reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return  this.initializeDb().then(() =>
      this.initRouter(routers).then(() => this));
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
