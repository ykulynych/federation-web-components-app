import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { createApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import type { PlatformElement, PlatformRouter, PlatformSdk } from '@demo/platform-sdk';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { PLATFORM_ROUTER, PLATFORM_SDK, PlatformLocationStrategy } from './platform';
import { REMOTE_CSS } from './remote-styles';

export class AngularAppElement extends HTMLElement implements PlatformElement {
  platformSdk!: PlatformSdk;
  router!: PlatformRouter;
  private appRef?: ApplicationRef;
  private styleElement?: HTMLStyleElement;
  private destroyed = false;

  async connectedCallback(): Promise<void> {
    if (!this.platformSdk || !this.router) {
      throw new Error('<angular-app-element> needs the platformSdk and router properties before it is attached.');
    }
    const basePath = this.getAttribute('base-path') ?? '/angular-app';
    const useShadow = this.getAttribute('shadow') !== 'none';

    // With Shadow DOM the CSS lives inside the root and is invisible to the page, and vice versa.
    // Without it the same CSS is global: the shell's classes reach in, and ours leak out.
    const container = useShadow ? (this.shadowRoot ?? this.attachShadow({ mode: 'open' })) : this;
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = REMOTE_CSS;
    (useShadow ? container : document.head).appendChild(this.styleElement);

    const mount = document.createElement('div');
    mount.className = 'angular-app';
    container.appendChild(mount);

    const appRef = await createApplication({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        { provide: PLATFORM_SDK, useValue: this.platformSdk },
        { provide: PLATFORM_ROUTER, useValue: this.router },
        { provide: APP_BASE_HREF, useValue: basePath },
        { provide: LocationStrategy, useClass: PlatformLocationStrategy },
      ],
    });
    if (this.destroyed) {
      appRef.destroy();
      return;
    }
    this.appRef = appRef;
    appRef.bootstrap(App, mount);
  }

  disconnectedCallback(): void {
    this.destroyed = true;
    this.appRef?.destroy();
    this.appRef = undefined;
    this.styleElement?.remove();
    this.replaceChildren();
    this.shadowRoot?.replaceChildren();
  }
}

if (!customElements.get('angular-app-element')) {
  customElements.define('angular-app-element', AngularAppElement);
}
