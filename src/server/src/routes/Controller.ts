import { Response, Router } from 'express';

export abstract class Controller {
  public router(): Router {
    const router = Router();

    // link routes from implementing class
    this.linkRoutes(router);

    return router;
  }

  protected abstract linkRoutes(router: Router): void;

  protected errorResp(res: Response, status: number, { error, msg }: { error?: string, msg?: string } = {}): void {
    if (!error) {
      switch (status) {
        case 400:
          error = 'Bad Request';
          break;
        case 404:
          error = 'Not Found';
          break;
        case 500:
          error = 'Internal Server Error';
          break;
        default:
          error = 'Unhandled error';
      }
    }

    res.status(status).json({
      error,
      msg,
    });
  }
}
