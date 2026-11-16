import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShellPlatformSdk } from '../platform/shell-platform-sdk';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Dashboard</h1>
    <section class="demo-card">
      <h3>Shell context</h3>
      <p>Current user: <strong>{{ sdk.getCurrentUser().name }}</strong> (id {{ sdk.getCurrentUser().id }})</p>
      <p>Theme: <strong>{{ sdk.theme() }}</strong></p>
      <p>Feature flags: <code>{{ sdk.featureFlags() | json }}</code></p>
      <button class="demo-btn" (click)="sdk.showNotification('Hello from the shell dashboard')">
        Notify from shell
      </button>
    </section>
    <section class="demo-card">
      <h3>Platform events (published through the SDK)</h3>
      @for (entry of sdk.eventLog(); track $index) {
        <div><code>{{ entry.event }}</code> {{ entry.payload | json }}</div>
      } @empty {
        <em>No events yet. Open an app and select a customer.</em>
      }
    </section>
  `,
  imports: [JsonPipe],
})
export class Dashboard {
  protected readonly sdk = inject(ShellPlatformSdk);
}
