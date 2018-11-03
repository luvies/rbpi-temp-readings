import { NodeServer } from 'express-ts-base';
import logger from 'morgan';
import { join } from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';
// import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
// import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';
import { Reading } from './models/reading';
import { Sensor } from './models/sensor';
import { ApiController } from './routes/api-controller';

const staticDir = 'static';

export class AppServer extends NodeServer {
  public faviconPath = join(__dirname, staticDir, 'favicon.ico');
  public staticBase = join(__dirname, staticDir);
  public useCatchAll = true;

  public async preConfigure() {
    this.express.use(logger('dev'));
  }

  public async mainConfigure() {
    const dbMode = process.env.DB_MODE;
    let conn: ConnectionOptions;
    const defaults: Partial<BaseConnectionOptions> = {
      entities: [
        Sensor,
        Reading,
      ],
      synchronize: true,
      logging: false,
    };
    switch (dbMode) {
      // case 'mariadb':
      //   conn = this.getConnMariaDb(defaults);
      //   break;
      // case 'sqlite':
      //   conn = this.getConnSqlite(defaults);
      //   break;
      default:
        conn = this.getConnSqljs(defaults);
        break;
    }

    try {
      await createConnection(conn);
    } catch (err) {
      console.log('Failed to connect, waiting to retry...');

      // wait a bit to retry
      const retryWait = 10000; // 10 secs
      await new Promise(resolve => setTimeout(resolve, retryWait));

      // try again without catching
      await createConnection(conn);
    }

    // load api routes
    this.express.use('/api/v1', new ApiController().router());
  }

  // private getConnMariaDb(defaults: Partial<BaseConnectionOptions>): MysqlConnectionOptions {
  //   return {
  //     ...defaults,
  //     type: 'mariadb',
  //     host: process.env.DB_HOST,
  //     port: Number(process.env.DB_PORT),
  //     username: process.env.DB_USERNAME,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_SCHEMA,
  //   };
  // }

  // private getConnSqlite(defaults: Partial<BaseConnectionOptions>): SqliteConnectionOptions {
  //   return {
  //     ...defaults,
  //     type: 'sqlite',
  //     database: process.env.DB_FILE_PATH || 'db/readings.db',
  //   };
  // }

  private getConnSqljs(defaults: Partial<BaseConnectionOptions>): SqljsConnectionOptions {
    return {
      ...defaults,
      type: 'sqljs',
      location: process.env.DB_FILE_PATH || 'db/readings.db',
      autoSave: true,
    };
  }
}
