import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { setPlatformSdk } from '@demo/platform-sdk';
import { routes } from './app.routes';
import { ShellPlatformSdk } from './platform/shell-platform-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => setPlatformSdk(inject(ShellPlatformSdk))),
  ],
};
