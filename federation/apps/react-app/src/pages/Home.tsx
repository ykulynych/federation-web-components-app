import { getPlatformSdk } from '@demo/platform-sdk';

export function Home() {
  const flags = getPlatformSdk().getFeatureFlags();
  return (
    <section className="demo-card">
      <h3>Home</h3>
      <p>Route: <code>/react-app</code>. Feature flags from the shell: <code>{JSON.stringify(flags)}</code></p>
    </section>
  );
}
