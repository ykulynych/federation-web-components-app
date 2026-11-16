import { useParams } from 'react-router';
import { usePlatform } from '../platform';

export function Details() {
  const { id } = useParams();
  const { sdk } = usePlatform();
  return (
    <section className="card">
      <h3>Order details</h3>
      <p>Order id from route: <strong data-testid="order-id">{id}</strong></p>
      <button className="btn" onClick={() => sdk.navigate('/angular-app/users')}>Go to Angular users</button>
    </section>
  );
}
