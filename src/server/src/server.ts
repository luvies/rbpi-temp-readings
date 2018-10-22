import { json } from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Express, urlencoded } from 'express';
import { existsSync } from 'fs';
import { createServer, Server } from 'http';
import logger from 'morgan';
import { join } from 'path';
import favicon from 'serve-favicon';
import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Reading } from './models/reading';
import { Sensor } from './models/sensor';
import { ApiController } from './routes/api-controller';

const staticDir = 'static';

export class NodeServer {
  private express: Express;
  private server?: Server;
  private port?: number;

  public constructor() {
    this.express = express();
    this.port = this.normalizePort(process.env.PORT || '3000');
  }

  public async configure() {
    const favPath = join(__dirname, staticDir, 'favicon.ico');
    if (existsSync(favPath)) {
      this.express.use(favicon(favPath));
    }
    this.express.use(logger('dev'));
    this.express.use(json());
    this.express.use(urlencoded({ extended: true }));
    this.express.use(cookieParser());
    this.express.use(compression());
    this.express.use(express.static(join(__dirname, staticDir)));

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

    // catch all other routes
    this.express.use('*', (_, res) => {
      res.sendStatus(404);
    });
  }

  public listen() {
    this.server = createServer(this.express);
    this.server.listen(this.port);
    this.server.on('error', error => this.onError(error));
    this.server.on('listening', () => this.onListening());
  }

  private normalizePort(val: string): number | undefined {
    const ival = parseInt(val, 10);
    if (isNaN(ival)) { // named pipe
      return ival;
    }
    if (ival >= 0) { // port number
      return ival;
    }
    return undefined;
  }

  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private onListening() {
    const addr = this.server!.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }
}
