declare namespace Api {
  namespace Sensor {
    interface Base {
      serialNum: string;
      desc: string;
    }

    interface Get extends Base {
      id: number;
    }

    interface Post extends Base { }

    interface Patch extends Partial<Base> { }
  }

  namespace Reading {
    interface Base {
      value: number;
      takenAt: string;
    }

    interface Get extends Base {
      id: number;
    }

    interface Post extends Base { }
  }
}
