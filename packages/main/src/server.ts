import handler from 'serve-handler';
import express, {type Express} from 'express';
import getPort from 'get-port';
import {ipcMain} from 'electron';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compresion from 'compression';
import cors from 'cors';

import type {IncomingMessage, Server as HttpServer, ServerResponse} from 'http';
import type {IpcMainEvent} from 'electron';

interface ServerParams {
  rendererDir: string;
}

interface StaticServeParams extends ServerParams {
  app: Express;
}

export class Server {
  public server: HttpServer<typeof IncomingMessage, typeof ServerResponse> | undefined;

  private fullbackPort = 53100;

  private serverPort = this.fullbackPort;

  private host = 'localhost';

  private currentUrl: URL | undefined;

  private rendererInitialized = false;

  get url() {
    return this.currentUrl;
  }

  async run({rendererDir}: ServerParams) {
    const envPort = import.meta.env.VITE_SERVER_PORT;
    this.serverPort = await getPort({port: parseInt(envPort, 10) || this.fullbackPort});
    this.currentUrl = new URL(`http://${this.host}:${this.serverPort}`);

    const app = express();

    this.middleware(app);

    this.routes(app);

    this.staticServe({app, rendererDir});

    this.ipcHandlers();

    this.server = app.listen(this.currentUrl.port, () => {
      console.debug(`[App] Server running on port ${this.serverPort}`);
    });

    return {
      server: this.server,
      url: this.currentUrl,
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
              source: '**/*.@(jpg|jpeg|gif|png)',
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
    app.use(bodyParser.json());
    if (import.meta.env.DEV) {
      app.use(logger('dev'));
    }

    app.use(
      cors({
        origin: (requestOrigin, callback) => {
          if (!requestOrigin) return callback(null, true);
          const allowedOrigins = [/^http:\/\/localhost/];
          if (this.currentUrl) {
            allowedOrigins.push(new RegExp(`^${this.currentUrl.origin}`));
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
    app.get('/api/hello', (req, res) => {
      res.json({message: 'Hello from server!'});
    });
  }

  ipcHandlers() {
    ipcMain.handle('renderer-ready', () => {
      if (this.rendererInitialized) return;
      console.debug('[App] Renderer Process is Ready.');
      this.rendererInitialized = true;
    });

    ipcMain.on('message', (event: IpcMainEvent) => {
      setTimeout(() => event.sender.send('message', 'hi from electron!!'), 500);
    });

    ipcMain.handle('get-server-url', () => {
      return this.currentUrl?.toString();
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
