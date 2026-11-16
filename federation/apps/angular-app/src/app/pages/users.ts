import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CUSTOMER_SELECTED_EVENT, getPlatformSdk, type Customer } from '@demo/platform-sdk';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-card">
      <h3>Users</h3>
      @for (customer of customers; track customer.id) {
        <p>
          {{ customer.name }}
          <button class="demo-btn" (click)="select(customer)">Select Customer</button>
        </p>
      }
    </section>
  `,
})
export class Users {
  private readonly sdk = getPlatformSdk();
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
