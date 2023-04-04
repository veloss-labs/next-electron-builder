import express, {type Express} from 'express';
import getPort from 'get-port';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compresion from 'compression';
import cookieParser from 'cookie-parser';
import next from 'next';
import cors from 'cors';
import path from 'path';
import {Logger} from './logging/logger';
import router from './routes';

import type {IncomingMessage, Server as HttpServer, ServerResponse} from 'http';
import type {RequestHandler} from 'next/dist/server/next';

interface ServerParams {
  rendererDir: string;
}

export class Server {
  public server: HttpServer<typeof IncomingMessage, typeof ServerResponse> | undefined;

  private defaultPort = 53100;

  private serverPort = this.defaultPort;

  private host = 'localhost';

  private url: URL | undefined;

  getUrl() {
    return this.url;
  }

  getHost() {
    return this.host;
  }

  getServerPort() {
    return this.serverPort;
  }

  getServer() {
    return this.server;
  }

  async run({rendererDir}: ServerParams) {
    const rendererPath = path.resolve(rendererDir);
    this.serverPort = await getPort({
      port: parseInt(import.meta.env.VITE_SERVER_PORT, 10) || this.defaultPort,
    });

    const app = next({
      dev: import.meta.env.DEV,
      dir: rendererPath,
    });

    const handle = app.getRequestHandler();

    this.url = new URL(`http://${this.host}:${this.serverPort}`);

    await app.prepare();

    const server = express();

    this.middleware(server);

    this.routes(server, handle);

    this.server = server
      .listen(this.url?.port, () => {
        Logger.debug('http', `[App] Server running on port ${this.serverPort}`);
      })
      .on('error', (error: Error) => {
        // @ts-ignore
        Logger.error('http', `[App] Server error: ${error.message}`);
      });

    return {
      url: this.url,
      server: this.server,
    };
  }

  middleware(app: Express) {
    app.use(
      compresion({
        level: 6,
      }),
    );
    app.use(helmet());
    app.use(cookieParser(import.meta.env.VITE_COOKIE_SECRET));
    app.use(bodyParser.json());
    app.use(
      morgan('tiny', {
        stream: {
          write: (str: string) => {
            Logger.info('http', str);
          },
        },
      }),
    );
    app.use(
      cors({
        origin: (requestOrigin, callback) => {
          if (!requestOrigin) return callback(null, true);
          const allowedOrigins = [/^http:\/\/localhost/];
          if (this.url) {
            allowedOrigins.push(new RegExp(`^${this.url.origin}`));
          }
          const valid = allowedOrigins.some(regex => regex.test(requestOrigin));
          if (valid) {
            return callback(null, true);
          }
          const msg =
            'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        },
      }),
    );
  }

  routes(app: Express, handle: RequestHandler) {
    app.use(router);

    app.get('*', (req, res) => handle(req, res));
  }

  close() {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    }
  }
}

export const server = new Server();
