import { NavLink, Route, Routes } from 'react-router';
import { CUSTOMER_SELECTED_EVENT, THEME_CHANGED_EVENT, type Customer } from '@demo/platform-sdk';
import { Details } from './pages/Details';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders';
import { usePlatform, useSdkEvent } from './platform';

export function App() {
  const { sdk } = usePlatform();
  const user = sdk.getCurrentUser();
  const theme = useSdkEvent(THEME_CHANGED_EVENT, sdk.getTheme());
  const customer = useSdkEvent<Customer | null>(CUSTOMER_SELECTED_EVENT, null);

  return (
    <>
      <h1>React App</h1>
      <section className="card">
        Hello <strong data-testid="react-user">{user.name}</strong> (id {user.id}) · theme <strong>{theme}</strong>
        <div data-testid="selected-customer">Selected customer: {customer ? customer.name : '—'}</div>
        <div className="actions">
          <button className="btn" onClick={() => sdk.showNotification(`Hello from the React remote, ${user.name}!`)}>
            Notify Shell
          </button>
        </div>
      </section>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/details/123">Details #123</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="*" element={<section className="card">Not found</section>} />
      </Routes>
    </>
  );
}
