import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('__ELECTRON_EXPOSURE__', {
  async getServerUrl(): Promise<string> {
    return await ipcRenderer.invoke('get-server-url');
  },
});
