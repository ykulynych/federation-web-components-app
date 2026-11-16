import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import * as esbuild from 'esbuild';

const PORT = 4302;
const OUT = 'dist';
const dev = process.argv.includes('--dev');

// The bundle is self-contained: React and React Router ship inside it, so the shell never needs to know about them.
const options = {
  entryPoints: { 'react-app-element': 'src/element.tsx' },
  bundle: true,
  format: 'esm',
  outdir: OUT,
  target: 'es2022',
  minify: !dev,
  sourcemap: dev,
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production') },
  logLevel: 'info',
};

if (!dev) {
  await esbuild.build(options);
} else {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const types = { '.js': 'text/javascript', '.map': 'application/json' };
  createServer((req, res) => {
    const path = normalize(join(OUT, new URL(req.url, 'http://x').pathname));
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!path.startsWith(OUT) || !existsSync(path) || !statSync(path).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    createReadStream(path).pipe(res);
  }).listen(PORT, () => console.log(`react-app element on http://localhost:${PORT}/react-app-element.js`));

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, async () => {
      await ctx.dispose();
      process.exit(0);
    });
  }
}
