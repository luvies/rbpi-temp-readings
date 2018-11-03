import { Request, Response, Router } from 'express';
import { Controller } from 'express-ts-base';
import { statuses } from '../../consts';
import { Sensor } from '../../models/sensor';
import { validator } from '../../validator';
import { ReadingsController } from './sensors/readings-controller';

export class SensorsController extends Controller {
  protected linkRoutes(router: Router): void {
    router.get('/', this.getIndex);
    router.get('/:sensorId', this.getSensor);
    router.post('/', this.postIndex);
    router.patch('/:sensorId', this.patchSensor);

    router.use('/:sensorId/readings', new ReadingsController().router());
  }

  private getIndex = async (req: Request, res: Response) => {
    res.json(await Sensor.find());
  }

  private getSensor = async (req: Request, res: Response) => {
    try {
      const sensor = await Sensor.findOneOrFail(req.params.sensorId);
      res.json(sensor);
    } catch (err) {
      this.errorJsonResp(res, statuses.NOT_FOUND);
    }
  }

  private postIndex = async (req: Request, res: Response) => {
    const sensor: unknown = req.body;
    if (validator.validateSensorPost(sensor)) {
      try {
        await Sensor.insert(sensor);
        res.sendStatus(statuses.CREATED);
      } catch (err) {
        this.errorJsonResp(res, statuses.SERVER_ERROR, {
          msg: err.message,
        });
      }
    } else {
      this.errorJsonResp(res, statuses.CLIENT_ERROR, {
        msg: 'Invalid sensor object',
      });
    }
  }

  private patchSensor = async (req: Request, res: Response) => {
    const sensor: unknown = req.body;
    if (validator.validateSensorPatch(sensor)) {
      try {
        await Sensor.update(req.params.sensorId, sensor);
        res.sendStatus(statuses.OK);
      } catch (err) {
        this.errorJsonResp(res, statuses.SERVER_ERROR, {
          msg: err.message,
        });
      }
    } else {
      this.errorJsonResp(res, statuses.CLIENT_ERROR, {
        msg: 'Invalid sensor object',
      });
    }
  }
}
