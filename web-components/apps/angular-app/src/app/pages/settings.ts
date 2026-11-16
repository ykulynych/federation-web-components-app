import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { PLATFORM_ROUTER, PLATFORM_SDK } from '../../platform';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="card">
      <h3>Settings</h3>
      <p>Navigation goes through the shell, so it also works across apps.</p>
      <button class="btn" (click)="sdk.navigate('/react-app/orders')">Open React orders</button>
      <button class="btn" (click)="router.navigate('/angular-app/users')">Back to users (PlatformRouter)</button>
    </section>
  `,
})
export class Settings {
  protected readonly sdk = inject(PLATFORM_SDK);
  protected readonly router = inject(PLATFORM_ROUTER);
}
