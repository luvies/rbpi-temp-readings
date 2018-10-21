import { Router } from 'express';
import { TestController } from './api/TestController';
import { Controller } from './Controller';

export class ApiController extends Controller {
  protected linkRoutes(router: Router): void {
    router.use('/test', new TestController().router());
  }
}
