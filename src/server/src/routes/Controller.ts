import { Router } from 'express';

export abstract class Controller {
  public router(): Router {
    const router = Router();

    // link routes from implementing class
    this.linkRoutes(router);

    return router;
  }

  protected abstract linkRoutes(router: Router): void;
}
