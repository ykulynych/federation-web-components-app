import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { getPlatformSdk } from '@demo/platform-sdk';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  template: `
    <section class="demo-card">
      <h3>Home</h3>
      <p>Route: <code>/angular-app</code>. Feature flags from the shell: <code>{{ sdk.getFeatureFlags() | json }}</code></p>
    </section>
  `,
})
export class Home {
  protected readonly sdk = getPlatformSdk();
}
