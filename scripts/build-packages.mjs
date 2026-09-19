import { build } from 'vite';
import { spawnSync } from 'node:child_process';
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

function run(args) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(['packages/tokens/scripts/generate.mjs']);
for (const name of ['tokens', 'icons', 'react']) {
  const root = resolve(`packages/${name}`);
  const source = resolve(root, `src/index.${name === 'icons' ? 'tsx' : 'ts'}`);
  await build({
    configFile: false,
    build: {
      outDir: resolve(root, 'dist'), emptyOutDir: true, sourcemap: true, cssCodeSplit: true,
      lib: { entry: name === 'react' ? { index: source, styles: resolve(root, 'src/styles.css') } : { index: source }, formats: ['es'], fileName: (_, entry) => `${entry}.js`, cssFileName: 'styles' },
      rollupOptions: { external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/], output: { assetFileNames: '[name][extname]' } },
    },
    esbuild: { jsx: 'automatic' },
  });
  run(['node_modules/typescript/bin/tsc', '-p', `packages/${name}/tsconfig.build.json`]);
}
await copyFile('packages/tokens/src/tokens.css', 'packages/tokens/dist/tokens.css');
await mkdir('packages/core/dist', { recursive: true });
const core = `${await readFile('packages/tokens/src/tokens.css', 'utf8')}\n${await readFile('packages/core/src/styles.css', 'utf8')}`;
await writeFile('packages/core/dist/styles.css', core);
for (const name of ['core', 'tokens', 'icons', 'react']) {
  await copyFile('LICENSE', `packages/${name}/LICENSE`);
}
console.log(`Core CSS: ${(gzipSync(core).length / 1024).toFixed(2)} KB gzip (target < 25 KB).`);
console.log('All four Dossier UI packages built.');
