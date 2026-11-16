import { StrictMode, useMemo, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { Router, type To } from 'react-router';
import { getPlatformSdk } from '@demo/platform-sdk';
import { App } from './App';
import styles from './styles.css';

export interface MountOptions {
  basePath: string;
  url: string;
}

export interface ReactAppHandle {
  update(url: string): void;
  unmount(): void;
}

function toRelative(url: string, basePath: string): string {
  return url.startsWith(basePath) ? url.slice(basePath.length) || '/' : '/';
}

function toUrl(to: To): string {
  if (typeof to === 'string') {
    return to;
  }
  return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
}

function injectStyles(): void {
  if (!document.getElementById('react-app-styles')) {
    const style = document.createElement('style');
    style.id = 'react-app-styles';
    style.textContent = styles;
    document.head.appendChild(style);
  }
}

/** The shell owns the URL: React Router only renders it, and every navigation goes through the SDK. */
export function mount(element: HTMLElement, { basePath, url }: MountOptions): ReactAppHandle {
  injectStyles();
  let current = toRelative(url, basePath);
  const listeners = new Set<() => void>();
  const store = {
    get: () => current,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  function Root() {
    const location = useSyncExternalStore(store.subscribe, store.get);
    const navigator = useMemo(() => {
      const go = (to: To) => getPlatformSdk().navigate(basePath + toUrl(to));
      return { createHref: (to: To) => basePath + toUrl(to), go: () => {}, push: go, replace: go };
    }, []);
    return (
      <Router location={location} navigator={navigator}>
        <App />
      </Router>
    );
  }

  const root = createRoot(element);
  root.render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );

  return {
    update(nextUrl) {
      const next = toRelative(nextUrl, basePath);
      if (next !== current) {
        current = next;
        listeners.forEach((listener) => listener());
      }
    },
    unmount: () => root.unmount(),
  };
}
