import { DestroyRef, inject, Injectable, InjectionToken, signal, type Signal } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy, type LocationChangeListener } from '@angular/common';
import type { PlatformRouter, PlatformSdk } from '@demo/platform-sdk';

export const PLATFORM_SDK = new InjectionToken<PlatformSdk>('PLATFORM_SDK');
export const PLATFORM_ROUTER = new InjectionToken<PlatformRouter>('PLATFORM_ROUTER');

/** Signal fed by a Platform SDK event; must be called in an injection context. */
export function sdkEventSignal<T>(event: string, initial: T): Signal<T> {
  const value = signal(initial);
  const unsubscribe = inject(PLATFORM_SDK).subscribe(event, (payload) => value.set(payload as T));
  inject(DestroyRef).onDestroy(unsubscribe);
  return value;
}

/**
 * Plugs the Angular Router into the shell's PlatformRouter instead of the browser history:
 * the shell owns the URL, this app only reads it and asks the shell to change it.
 */
@Injectable()
export class PlatformLocationStrategy extends LocationStrategy {
  private readonly platformRouter = inject(PLATFORM_ROUTER);
  private readonly base = inject(APP_BASE_HREF);

  override path(): string {
    return this.platformRouter.currentPath();
  }

  override prepareExternalUrl(internal: string): string {
    if (internal === '' || internal === '/') {
      return this.base;
    }
    return this.base + (internal.startsWith('/') || internal.startsWith('?') ? internal : `/${internal}`);
  }

  override getState(): unknown {
    return null;
  }

  override pushState(_state: unknown, _title: string, url: string, queryParams: string): void {
    this.platformRouter.navigate(this.prepareExternalUrl(url + normalizeQuery(queryParams)));
  }

  override replaceState(state: unknown, title: string, url: string, queryParams: string): void {
    this.pushState(state, title, url, queryParams);
  }

  override forward(): void {
    history.forward();
  }

  override back(): void {
    history.back();
  }

  override onPopState(fn: LocationChangeListener): void {
    this.platformRouter.subscribe(() => fn({ type: 'popstate', state: null }));
  }

  override getBaseHref(): string {
    return this.base;
  }
}

function normalizeQuery(query: string): string {
  return query && !query.startsWith('?') ? `?${query}` : query;
}
