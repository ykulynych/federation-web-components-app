import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4200';
const errors = [];
let step = 0;

function check(condition, message) {
  step++;
  if (!condition) {
    throw new Error(`Step ${step} failed: ${message}`);
  }
  console.log(`ok ${step} - ${message}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const text = (testId) => page.getByTestId(testId).innerText();
const path = () => new URL(page.url()).pathname;
const snackbar = (message) => page.locator('.mat-mdc-snack-bar-container', { hasText: message });

try {
  await page.goto(BASE);
  await page.getByText('Dashboard', { exact: true }).first().waitFor();
  check(true, 'shell renders header and side menu');

  await page.getByRole('link', { name: 'Angular App' }).click();
  await page.getByTestId('ng-user').waitFor();
  check((await text('ng-user')) === 'George' && path() === '/angular-app', 'Angular app shows the shell user at /angular-app');

  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'Notify Shell' }).click();
  await snackbar('Hello from the Angular remote').waitFor();
  check(path() === '/angular-app/users', 'Angular remote notification shows a shell snackbar, nested route works');

  await page.getByRole('button', { name: 'Select Customer' }).first().click();
  await snackbar('Customer selected: Acme Corp').waitFor();

  await page.getByRole('link', { name: 'React App' }).click();
  await page.getByTestId('react-user').waitFor();
  check((await text('react-user')) === 'George', 'React app shows the same shell user');
  check((await text('selected-customer')).includes('Acme Corp'), 'React app received customer-selected published by the Angular app');

  await page.getByRole('button', { name: 'Notify Shell' }).click();
  await snackbar('Hello from the React remote').waitFor();
  check(true, 'React remote notification shows a shell snackbar');

  await page.getByRole('link', { name: 'Orders' }).click();
  await page.getByRole('link', { name: 'Order 1001' }).click();
  await page.getByTestId('order-id').waitFor();
  check((await text('order-id')) === '1001' && path() === '/react-app/details/1001', 'React inner routing keeps the shell URL in sync');

  await page.goBack();
  await page.getByRole('link', { name: 'Order 1002' }).waitFor();
  check(path() === '/react-app/orders', 'browser back is handled by the shell and reaches React');

  await page.goto(`${BASE}/react-app/details/123`);
  await page.getByTestId('order-id').waitFor();
  check((await text('order-id')) === '123', 'deep link into a React route works');

  await page.getByRole('button', { name: 'Go to Angular users' }).click();
  await page.getByRole('button', { name: 'Select Customer' }).first().waitFor();
  check(path() === '/angular-app/users', 'React -> shell navigate() lands in the Angular app');

  await page.getByRole('button', { name: /^Theme:/ }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  check(true, 'shell theme toggle updates the document');
  await page.getByRole('link', { name: 'React App' }).click();
  await page.getByTestId('react-user').waitFor();
  check((await page.locator('text=theme').first().innerText()).includes('dark'), 'remote sees the dark theme from the shell');

  if (errors.length) {
    throw new Error(`Browser errors:\n${errors.join('\n')}`);
  }
  console.log('Smoke test passed');
} catch (e) {
  await page.screenshot({ path: 'e2e/failure.png' }).catch(() => {});
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
