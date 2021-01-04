import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { environment } from '../common/environment';
import { Router } from '../common/routes';
import {mergePatchBodyParser} from './merge-patch.parser';
import { handleError } from './error.handler';

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
        //server
        this.application = restify.createServer({
          name: 'meat_api_teste',
          version: '1.0.0'
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

        //routes
        for (let router of routers) {
          router.applyRouters(this.application);
        }

        this.application.listen(environment.server.port, () => {
          return resolve(this.application);
        });

        this.application.on('restifyError', handleError);

      } catch (error) {
        return reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return  this.initializeDb().then(() =>
      this.initRouter(routers).then(() => this));
  }
}
