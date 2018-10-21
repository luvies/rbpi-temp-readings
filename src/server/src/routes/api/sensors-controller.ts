import { Request, Response, Router } from 'express';
import { Sensor } from '../../models/sensor';
import { validator } from '../../validator';
import { Controller } from '../controller';

export class SensorsController extends Controller {
  protected linkRoutes(router: Router): void {
    router.get('/', (req, res) => this.getIndex(req, res));
    router.get('/:id', (req, res) => this.getSensor(req, res));
    router.post('/', (req, res) => this.postIndex(req, res));
    router.patch('/:id', (req, res) => this.patchSensor(req, res));
  }

  private async getIndex(req: Request, res: Response) {
    res.json(await Sensor.find());
  }

  private async getSensor(req: Request, res: Response) {
    const search = await Sensor.find({
      id: req.params.id,
    });
    if (search.length === 0) {
      this.errorResp(res, 404);
    } else if (search.length === 1) {
      res.json(search[0]);
    } else {
      this.errorResp(res, 500, {
        msg: 'More than one result',
      });
    }
  }

  private async postIndex(req: Request, res: Response) {
    const sensor: unknown = req.body;
    if (validator.validateSensorPost(sensor)) {
      try {
        await Sensor.insert(sensor);
        res.sendStatus(201);
      } catch (err) {
        this.errorResp(res, 500, {
          msg: err.message,
        });
      }
    } else {
      this.errorResp(res, 400, {
        msg: 'Invalid sensor object',
      });
    }
  }

  private async patchSensor(req: Request, res: Response) {
    const sensor: unknown = req.body;
    if (validator.validateSensorPatch(sensor)) {
      try {
        await Sensor.update(req.params.id, sensor);
        res.sendStatus(200);
      } catch (err) {
        this.errorResp(res, 500, {
          msg: err.message,
        });
      }
    } else {
      this.errorResp(res, 400, {
        msg: 'Invalid sensor object',
      });
    }
  }
}
