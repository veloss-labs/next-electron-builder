import handler from 'serve-handler';
import express, {type Express} from 'express';
import getPort from 'get-port';
import {ipcMain} from 'electron';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compresion from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Logger} from './logging/logger';
import router from './routes';

import type {IncomingMessage, Server as HttpServer, ServerResponse} from 'http';

interface ServerParams {
  rendererDir: string;
}

interface StaticServeParams extends ServerParams {
  app: Express;
}

export class Server {
  public server: HttpServer<typeof IncomingMessage, typeof ServerResponse> | undefined;

  private defaultPort = 53100;

  private serverPort = this.defaultPort;

  private host = 'localhost';

  private url: URL | undefined;

  private rendererInitialized = false;

  async run({rendererDir}: ServerParams) {
    const envPort = import.meta.env.VITE_SERVER_PORT;
    this.serverPort = await getPort({port: parseInt(envPort, 10) || this.defaultPort});
    this.url = new URL(`http://${this.host}:${this.serverPort}`);

    const app = express();

    this.middleware(app);

    this.routes(app);

    this.staticServe({app, rendererDir});

    this.ipcHandlers();

    this.server = app.listen(this.url.port, () => {
      console.debug(`[App] Server running on port ${this.serverPort}`);
    });

    return {
      server: this.server,
      url: this.url,
    };
  }

  staticServe({app, rendererDir}: StaticServeParams) {
    if (import.meta.env.PROD) {
      app.get('*', async (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        await handler(req, res, {
          public: rendererDir,
          trailingSlash: true,
          headers: [
            {
              source: '**/*.@(jpg|jpeg|gif|png|svg)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '**/*.@(js|css)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000',
                },
              ],
            },
            {
              source: '**/*.@(woff|woff2|ttf|otf)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ],
        });
      });
    }
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

  routes(app: Express) {
    app.use(router);
  }

  ipcHandlers() {
    ipcMain.handle('renderer-ready', () => {
      if (this.rendererInitialized) return;
      Logger.debug('ipc', 'Renderer Process is Ready.');
      this.rendererInitialized = true;
    });

    ipcMain.handle('get-server-url', () => {
      Logger.debug('ipc', 'Getting Server URL.');
      return this.url?.toString();
    });

    ipcMain.handle('get-server-port', () => {
      return this.serverPort;
    });
  }

  close() {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    }
  }
}

export const server = new Server();
