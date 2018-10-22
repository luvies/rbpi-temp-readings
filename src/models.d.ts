declare namespace Models {
  export namespace Api {
    interface ReadingBase {
      value: number;
      takenAt: string;
    }

    interface SensorBase {
      serialNum: string;
      desc: string;
    }

    export namespace Get {
      export interface Reading extends ReadingBase {
        id: number;
      }

      export interface Sensor extends SensorBase {
        id: number;
      }
    }

    export namespace Post {
      export interface Reading extends ReadingBase {
      }

      export interface Sensor extends SensorBase {
      }
    }

    export namespace Patch {
      export interface Sensor extends Partial<SensorBase> {
      }
    }
  }
}
