import { Router } from 'express';
import { SensorsController } from './api/sensors-controller';
import { Controller } from './controller';

export class ApiController extends Controller {
  protected linkRoutes(router: Router): void {
    router.use('/sensors', new SensorsController().router());
  }
}
