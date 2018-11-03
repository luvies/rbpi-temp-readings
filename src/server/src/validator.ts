import Ajv from 'ajv';
import ReadingPostSchema from './schemas/reading-post.json';
import SensorPatchSchema from './schemas/sensor-patch.json';
import SensorPostSchema from './schemas/sensor-post.json';

interface Validators {
  reading: {
    post: Ajv.ValidateFunction;
  };
  sensor: {
    post: Ajv.ValidateFunction;
    patch: Ajv.ValidateFunction;
  };
}

export class Validator {
  private validators: Validators;

  public constructor() {
    const ajv = new Ajv();
    this.validators = {
      reading: {
        post: ajv.compile(ReadingPostSchema),
      },
      sensor: {
        patch: ajv.compile(SensorPatchSchema),
        post: ajv.compile(SensorPostSchema),
      },
    };
  }

  public validateReadingPost(obj: unknown): obj is Api.Reading.Post {
    return this.validators.reading.post(obj) as boolean;
  }

  public validateSensorPatch(obj: unknown): obj is Api.Sensor.Patch {
    return this.validators.sensor.patch(obj) as boolean;
  }

  public validateSensorPost(obj: unknown): obj is Api.Sensor.Post {
    return this.validators.sensor.post(obj) as boolean;
  }
}

export const validator = new Validator();
