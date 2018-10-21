import { Request, Response, Router } from 'express';
import { Sensor } from '../../models/sensor';
import { Controller } from '../Controller';

export class TestController extends Controller {
  protected linkRoutes(router: Router): void {
    router.get('/', (req, res) => this.getIndex(req, res));
  }

  private async getIndex(_: Request, res: Response) {
    await Sensor.insert([
      {
        serialNum: 'test1',
        desc: 'test 1',
      },
      {
        serialNum: 'test2',
        desc: 'test 1',
      },
      {
        serialNum: 'test3',
        desc: 'test 1',
      },
    ]);
    res.json(await Sensor.find());
  }
}
