import * as restify from 'restify';

export abstract class Router {
  abstract applyRouters(application: restify.Server);
}
