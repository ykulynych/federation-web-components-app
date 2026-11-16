import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { getPlatformSdk, THEME_CHANGED_EVENT } from '@demo/platform-sdk';
import { sdkEventSignal } from '../platform';

@Component({
  selector: 'app-remote-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Angular App</h1>
    <section class="demo-card">
      Hello <strong data-testid="ng-user">{{ sdk.getCurrentUser().name }}</strong>
      (id {{ sdk.getCurrentUser().id }}) · theme <strong>{{ theme() }}</strong>
      <div class="actions">
        <button class="demo-btn" (click)="notify()">Notify Shell</button>
      </div>
    </section>
    <nav class="demo-tabs">
      <a routerLink="." routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="users" routerLinkActive="active">Users</a>
      <a routerLink="settings" routerLinkActive="active">Settings</a>
    </nav>
    <router-outlet />
  `,
  styles: `
    .actions { margin-top: 12px; }
    nav { margin-bottom: 16px; }
    .active { font-weight: 700; }
  `,
})
export class RemoteLayout {
  protected readonly sdk = getPlatformSdk();
  protected readonly theme = sdkEventSignal(THEME_CHANGED_EVENT, this.sdk.getTheme());

  protected notify(): void {
    this.sdk.showNotification(`Hello from the Angular remote, ${this.sdk.getCurrentUser().name}!`);
  }
}
