import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import type { PlatformRouter, Unsubscribe } from '@demo/platform-sdk';

/** The shell owns the URL; remotes read it and ask for changes through this contract. */
@Injectable({ providedIn: 'root' })
export class ShellPlatformRouter implements PlatformRouter {
  private readonly router = inject(Router);
  private readonly handlers = new Set<(url: string) => void>();

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handlers.forEach((handler) => handler(event.urlAfterRedirects));
      }
    });
  }

  currentPath(): string {
    return this.router.url;
  }

  navigate(url: string): void {
    void this.router.navigateByUrl(url);
  }

  subscribe(handler: (url: string) => void): Unsubscribe {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
}
