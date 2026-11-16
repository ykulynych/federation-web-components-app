import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  EventBus,
  THEME_CHANGED_EVENT,
  type FeatureFlags,
  type PlatformSdk,
  type Theme,
  type Unsubscribe,
  type User,
} from '@demo/platform-sdk';
import { UserContextService } from './user-context.service';

export interface PlatformEvent {
  event: string;
  payload: unknown;
}

/** The shell's implementation of the Platform SDK, registered once with setPlatformSdk(). */
@Injectable({ providedIn: 'root' })
export class ShellPlatformSdk implements PlatformSdk {
  private readonly userContext = inject(UserContextService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly bus = new EventBus();

  readonly theme = signal<Theme>('light');
  readonly featureFlags = signal<FeatureFlags>({ newOrdersTable: true, betaSettings: false });
  readonly eventLog = signal<PlatformEvent[]>([]);

  getCurrentUser(): User {
    return this.userContext.getCurrentUser();
  }

  getTheme(): Theme {
    return this.theme();
  }

  getFeatureFlags(): FeatureFlags {
    return this.featureFlags();
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  navigate(url: string): void {
    void this.router.navigateByUrl(url);
  }

  publish(event: string, payload: unknown): void {
    this.eventLog.update((log) => [{ event, payload }, ...log].slice(0, 8));
    this.bus.publish(event, payload);
  }

  subscribe(event: string, handler: (payload: unknown) => void): Unsubscribe {
    return this.bus.subscribe(event, handler);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
    this.publish(THEME_CHANGED_EVENT, theme);
  }
}
