declare namespace Models {
  export namespace Api {
    interface SensorBase {
      serialNum: string;
      desc: string;
    }

    export namespace Post {
      export interface Reading {
        value: number;
        takenAt: string;
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
