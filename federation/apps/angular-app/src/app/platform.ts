import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import { getPlatformSdk } from '@demo/platform-sdk';

/** Signal fed by a Platform SDK event; must be called in an injection context. */
export function sdkEventSignal<T>(event: string, initial: T): Signal<T> {
  const value = signal(initial);
  const unsubscribe = getPlatformSdk().subscribe(event, (payload) => value.set(payload as T));
  inject(DestroyRef).onDestroy(unsubscribe);
  return value;
}
