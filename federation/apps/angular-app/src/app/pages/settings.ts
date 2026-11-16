import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getPlatformSdk } from '@demo/platform-sdk';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-card">
      <h3>Settings</h3>
      <p>Navigation goes through the shell, so it also works across apps.</p>
      <button class="demo-btn" (click)="sdk.navigate('/react-app/orders')">Open React orders</button>
      <button class="demo-btn" (click)="sdk.navigate('/angular-app/users')">Back to users</button>
    </section>
  `,
})
export class Settings {
  protected readonly sdk = getPlatformSdk();
}
