import { usePlatform } from '../platform';

export function Home() {
  const { sdk } = usePlatform();
  return (
    <>
      <section className="card">
        <h3>Home</h3>
        <p>Route: <code>/react-app</code>. Feature flags from the shell: <code>{JSON.stringify(sdk.getFeatureFlags())}</code></p>
      </section>
      <section className="card">
        <h3 data-testid="probe-heading">CSS isolation probe</h3>
        <button className="demo-btn" data-testid="shell-btn">Uses the shell's .demo-btn class</button>
        <div className="probe" data-testid="remote-probe">Remote .probe element</div>
      </section>
    </>
  );
}
