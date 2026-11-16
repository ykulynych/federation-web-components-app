import { useParams } from 'react-router';
import { getPlatformSdk } from '@demo/platform-sdk';

export function Details() {
  const { id } = useParams();
  const sdk = getPlatformSdk();
  return (
    <section className="demo-card">
      <h3>Order details</h3>
      <p>Order id from route: <strong data-testid="order-id">{id}</strong></p>
      <button className="demo-btn" onClick={() => sdk.navigate('/angular-app/users')}>Go to Angular users</button>
    </section>
  );
}
