import { NodeServer } from 'express-ts-base';
import logger from 'morgan';
import { join } from 'path';
import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
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
    const conn: MysqlConnectionOptions = {
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [
        Sensor,
        Reading,
      ],
      synchronize: true,
      logging: false,
    };

    try {
      await createConnection(conn);
    } catch (err) {
      console.log('Failed to connect, waiting to retry...');

      // wait a bit to retry
      await new Promise(resolve => setTimeout(resolve, 10000));

      // try again without catching
      await createConnection(conn);
    }

    // load api routes
    this.express.use('/api/v1', new ApiController().router());
  }
}
