import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { THEME_CHANGED_EVENT } from '@demo/platform-sdk';
import { PLATFORM_SDK, sdkEventSignal } from '../platform';

@Component({
  selector: 'app-angular-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Angular App</h1>
    <section class="card">
      Hello <strong data-testid="ng-user">{{ sdk.getCurrentUser().name }}</strong>
      (id {{ sdk.getCurrentUser().id }}) · theme <strong>{{ theme() }}</strong>
      <div class="actions">
        <button class="btn" (click)="notify()">Notify Shell</button>
      </div>
    </section>
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/users" routerLinkActive="active">Users</a>
      <a routerLink="/settings" routerLinkActive="active">Settings</a>
    </nav>
    <router-outlet />
  `,
})
export class App {
  protected readonly sdk = inject(PLATFORM_SDK);
  protected readonly theme = sdkEventSignal(THEME_CHANGED_EVENT, this.sdk.getTheme());

  protected notify(): void {
    this.sdk.showNotification(`Hello from the Angular remote, ${this.sdk.getCurrentUser().name}!`);
  }
}
