import { StrictMode, useMemo, useSyncExternalStore } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Router, type To } from 'react-router';
import type { PlatformElement, PlatformRouter, PlatformSdk } from '@demo/platform-sdk';
import { App } from './App';
import { PlatformContext, type Platform } from './platform';
import styles from './styles.css';

function toUrl(to: To): string {
  if (typeof to === 'string') {
    return to;
  }
  return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
}

function RoutedApp({ platform }: { platform: Platform }) {
  const { router, basePath } = platform;
  const url = useSyncExternalStore(
    (onChange) => router.subscribe(() => onChange()),
    () => router.currentPath(),
  );
  const location = url.startsWith(basePath) ? url.slice(basePath.length) || '/' : '/';
  const navigator = useMemo(() => {
    const go = (to: To) => router.navigate(basePath + toUrl(to));
    return { createHref: (to: To) => basePath + toUrl(to), go: () => {}, push: go, replace: go };
  }, [router, basePath]);

  return (
    <Router location={location} navigator={navigator}>
      <App />
    </Router>
  );
}

export class ReactAppElement extends HTMLElement implements PlatformElement {
  platformSdk!: PlatformSdk;
  router!: PlatformRouter;
  private root?: Root;
  private styleElement?: HTMLStyleElement;

  connectedCallback(): void {
    if (!this.platformSdk || !this.router) {
      throw new Error('<react-app-element> needs the platformSdk and router properties before it is attached.');
    }
    const basePath = this.getAttribute('base-path') ?? '/react-app';
    const useShadow = this.getAttribute('shadow') !== 'none';

    // With Shadow DOM the CSS lives inside the root and is invisible to the page, and vice versa.
    // Without it the same CSS is global: the shell's classes reach in, and ours leak out.
    const container = useShadow ? (this.shadowRoot ?? this.attachShadow({ mode: 'open' })) : this;
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = styles;
    (useShadow ? container : document.head).appendChild(this.styleElement);

    const mount = document.createElement('div');
    mount.className = 'react-app';
    container.appendChild(mount);

    const platform: Platform = { sdk: this.platformSdk, router: this.router, basePath };
    this.root = createRoot(mount);
    this.root.render(
      <StrictMode>
        <PlatformContext.Provider value={platform}>
          <RoutedApp platform={platform} />
        </PlatformContext.Provider>
      </StrictMode>,
    );
  }

  disconnectedCallback(): void {
    this.root?.unmount();
    this.root = undefined;
    this.styleElement?.remove();
    this.replaceChildren();
    this.shadowRoot?.replaceChildren();
  }
}

if (!customElements.get('react-app-element')) {
  customElements.define('react-app-element', ReactAppElement);
}
