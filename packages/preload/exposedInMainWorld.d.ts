interface Window {
    readonly __ELECTRON_EXPOSURE__: { getServerUrl(): Promise<string>; rendererInitialized(): Promise<void>; };
}
