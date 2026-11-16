import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { PLATFORM_SDK } from '../../platform';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe],
  template: `
    <section class="card">
      <h3>Home</h3>
      <p>Route: <code>/angular-app</code>. Feature flags from the shell: <code>{{ sdk.getFeatureFlags() | json }}</code></p>
    </section>
    <section class="card">
      <h3 data-testid="probe-heading">CSS isolation probe</h3>
      <button class="demo-btn" data-testid="shell-btn">Uses the shell's .demo-btn class</button>
      <div class="probe" data-testid="remote-probe">Remote .probe element</div>
    </section>
  `,
})
export class Home {
  protected readonly sdk = inject(PLATFORM_SDK);
}
