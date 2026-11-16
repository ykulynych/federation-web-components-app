import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { CUSTOMER_SELECTED_EVENT, type Customer } from '@demo/platform-sdk';
import { PLATFORM_SDK } from '../../platform';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="card">
      <h3>Users</h3>
      @for (customer of customers; track customer.id) {
        <p>
          {{ customer.name }}
          <button class="btn" (click)="select(customer)">Select Customer</button>
        </p>
      }
    </section>
  `,
})
export class Users {
  private readonly sdk = inject(PLATFORM_SDK);
  protected readonly customers: Customer[] = [
    { id: 'c1', name: 'Acme Corp' },
    { id: 'c2', name: 'Globex' },
    { id: 'c3', name: 'Initech' },
  ];

  protected select(customer: Customer): void {
    this.sdk.publish(CUSTOMER_SELECTED_EVENT, customer);
    this.sdk.showNotification(`Customer selected: ${customer.name}`);
  }
}
