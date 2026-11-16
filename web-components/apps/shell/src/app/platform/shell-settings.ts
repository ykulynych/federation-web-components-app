import { Injectable, signal } from '@angular/core';
import type { ShadowMode } from '@demo/platform-sdk';

@Injectable({ providedIn: 'root' })
export class ShellSettings {
  /** "open": remotes render inside a shadow root (variant A); "none": light DOM (variant B). */
  readonly shadowMode = signal<ShadowMode>('open');

  toggleShadowMode(): void {
    this.shadowMode.update((mode) => (mode === 'open' ? 'none' : 'open'));
  }
}
