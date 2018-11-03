import dateFormat from 'dateformat';
import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from 'express-ts-base';
import { statuses } from '../../../consts';
import { Reading } from '../../../models/reading';
import { Sensor } from '../../../models/sensor';
import { validator } from '../../../validator';

export class ReadingsController extends Controller {
  protected linkRoutes(router: Router): void {
    router.use(this.ensureSensor);
    router.get('/', this.getIndex);
    router.post('/', this.postIndex);
  }

  private ensureSensor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sensor = await Sensor.findOneOrFail(req.params.sensorId);
      (res.locals = res.locals || {}).readingsSensor = sensor;
      next();
    } catch (err) {
      this.errorJsonResp(res, statuses.NOT_FOUND);
    }
  }

  private getIndex = async (req: Request, res: Response) => {
    const sensor = this.getSensor(res);

    // init query
    let search = Reading
      .createQueryBuilder()
      .where('reading_sen_id = :id', { id: sensor.id })
      .orderBy('reading_taken_at', 'ASC');

    // if after query exists, use it
    if (req.query.after) {
      const after = new Date(req.query.after);
      if (isNaN(after.getTime())) {
        this.errorJsonResp(res, statuses.CLIENT_ERROR, {
          msg: 'Query param \'after\' not a valid date',
        });
        return;
      }
      search = search.andWhere('reading_taken_at > :after', {
        after: dateFormat(after, 'yyyy-mm-dd HH:MM:SS'),
      });
    }

    // if before query exists, use it
    if (req.query.before) {
      const before = new Date(req.query.before);
      if (isNaN(before.getTime())) {
        this.errorJsonResp(res, statuses.CLIENT_ERROR, {
          msg: 'Query param \'before\' not a valid date',
        });
        return;
      }
      search = search.andWhere('reading_taken_at < :before', {
        before: dateFormat(before, 'yyyy-mm-dd HH:MM:SS'),
      });
    }

    // execute query
    res.json(await search.getMany());
  }

  private postIndex = async (req: Request, res: Response) => {
    const sensor = this.getSensor(res);
    const reading: unknown = req.body;
    if (validator.validateReadingPost(reading)) {
      try {
        await Reading.insert({
          ...reading,
          sensor,
        });
        res.sendStatus(statuses.CREATED);
      } catch (err) {
        this.errorJsonResp(res, statuses.SERVER_ERROR, {
          msg: err.message,
        });
      }
    } else {
      this.errorJsonResp(res, statuses.NOT_FOUND, {
        msg: 'Invalid reading object',
      });
    }
  }

  private getSensor(res: Response): Sensor {
    return res.locals.readingsSensor;
  }
}
