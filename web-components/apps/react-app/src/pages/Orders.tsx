import { Link } from 'react-router';

const ORDERS = ['1001', '1002', '1003'];

export function Orders() {
  return (
    <section className="card">
      <h3>Orders</h3>
      <ul>
        {ORDERS.map((id) => (
          <li key={id}>
            <Link to={`/details/${id}`}>Order {id}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
