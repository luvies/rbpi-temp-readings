import { Router } from 'express';
import { Controller } from 'express-ts-base';
import { SensorsController } from './api/sensors-controller';

export class ApiController extends Controller {
  protected linkRoutes(router: Router): void {
    router.use('/sensors', new SensorsController().router());
  }
}
