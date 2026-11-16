import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { runEsBuildBuilder } from '@softarc/native-federation-esbuild';

const PORT = 4202;
const OUT = 'dist';
const dev = process.argv.includes('--dev');

const federation = await runEsBuildBuilder('federation.config.mjs', {
  outputPath: OUT,
  tsConfig: 'tsconfig.json',
  entryPoints: ['src/mount.tsx'],
  dev,
  watch: dev,
  adapterConfig: { plugins: [], loader: { '.css': 'text' } },
});

if (!dev) {
  await federation.close();
  console.log('Build complete.');
} else {
  const types = { '.json': 'application/json', '.js': 'text/javascript', '.mjs': 'text/javascript', '.map': 'application/json' };
  createServer((req, res) => {
    const path = normalize(join(OUT, new URL(req.url, 'http://x').pathname));
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!path.startsWith(OUT) || !existsSync(path) || !statSync(path).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    createReadStream(path).pipe(res);
  }).listen(PORT, () => console.log(`react-app remote on http://localhost:${PORT}/remoteEntry.json`));

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, async () => {
      await federation.close();
      process.exit(0);
    });
  }
}
