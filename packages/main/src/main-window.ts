import {app, BrowserWindow} from 'electron';
import {join} from 'node:path';
import {appState} from './app-state';
import {server} from './server';
import {electronWindow} from './window';

async function createWindow() {
  const browserWindow = electronWindow.run();

  /**
   * Start Next.js With Custom Express Server
   */
  const {url} = await server.run({
    rendererDir: join(app.getAppPath(), import.meta.env.VITE_RENDERER_DIR),
  });

  appState.run();
  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_RENDERER_URL !== undefined
      ? import.meta.env.VITE_RENDERER_URL
      : url.toString();

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
