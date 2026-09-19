import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';

console.log('\n--- Building Dossier UI Documentation for GitHub Pages ---\n');

// 1. Build all packages first to ensure latest types and css
execSync('node scripts/build-packages.mjs', { stdio: 'inherit' });

// 2. Build the documentation app with relative base
execSync('pnpm exec vite build --config apps/docs/vite.config.ts', { stdio: 'inherit' });

const dist = resolve('apps/docs/dist');

// 3. Create .nojekyll to prevent Jekyll processing on GitHub Pages
writeFileSync(resolve(dist, '.nojekyll'), '');

// 4. Deploy dist directly to gh-pages branch
console.log('\n--- Deploying dist to gh-pages branch on GitHub ---\n');

try {
  rmSync(resolve(dist, '.git'), { recursive: true, force: true });
} catch {
  // ignore
}

execSync('git init', { cwd: dist, stdio: 'inherit' });
execSync('git config core.sshCommand "ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes"', { cwd: dist, stdio: 'inherit' });
execSync('git add -A', { cwd: dist, stdio: 'inherit' });
execSync('git commit -m "Deploy documentation to GitHub Pages [skip ci]"', { cwd: dist, stdio: 'inherit' });
execSync('git remote add origin git@github.com:VikramAditya10/dossier_ui.git', { cwd: dist, stdio: 'inherit' });
execSync('git push -f origin HEAD:gh-pages', { cwd: dist, stdio: 'inherit' });

// Clean up temporary .git inside dist
try {
  rmSync(resolve(dist, '.git'), { recursive: true, force: true });
} catch {
  // ignore
}

console.log('\n✔ Live documentation project page successfully deployed!');
console.log('URL: https://vikramaditya10.github.io/dossier_ui/\n');
