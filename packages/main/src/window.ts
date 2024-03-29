import {join} from 'node:path';
import {app, BrowserWindow} from 'electron';

export class ElectronWindow {
  browserWindow: BrowserWindow | undefined;

  getBrowserWindow() {
    return this.browserWindow;
  }

  run() {
    if (this.browserWindow) {
      this.browserWindow.destroy();
      this.browserWindow = undefined;
    }

    this.browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
      },
    });

    /**
     * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
     * it then defaults to 'true'. This can cause flickering as the window loads the html content,
     * and it also has show problematic behaviour with the closing of the window.
     * Use `show: false` and listen to the  `ready-to-show` event to show the window.
     *
     * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
     */
    this.browserWindow.on('ready-to-show', () => {
      this.browserWindow?.show();

      if (import.meta.env.DEV) {
        this.browserWindow?.webContents.openDevTools();
      }
    });

    return this.browserWindow;
  }
}

export const electronWindow = new ElectronWindow();
