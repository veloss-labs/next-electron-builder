import {ipcMain} from 'electron';
import {Logger} from './logging/logger';
import {server} from './server';

export class AppState {
  private rendererInitialized = false;

  run() {
    try {
      this.ipcHandlers();
    } catch (error) {
      if (error instanceof Error) {
        Logger.info('task', error.message);
      }
    }
  }

  ipcHandlers() {
    ipcMain.handle('renderer-ready', () => {
      if (this.rendererInitialized) return;
      Logger.debug('ipc', 'Renderer Process is Ready.');
      this.rendererInitialized = true;
    });
    ipcMain.handle('get-server-url', () => {
      Logger.debug('ipc', 'Getting Server URL.');
      return server.getUrl()?.toString();
    });
    ipcMain.handle('get-server-port', () => {
      return server.getServerPort();
    });
  }
}

export const appState = new AppState();
