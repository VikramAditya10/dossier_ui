import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const PACKAGES = ['core', 'tokens', 'icons', 'react'];
let errors = 0;
let warnings = 0;

function logSuccess(msg) {
  console.log(`\x1b[32m✔\x1b[0m ${msg}`);
}
function logWarn(msg) {
  warnings++;
  console.log(`\x1b[33m⚠\x1b[0m ${msg}`);
}
function logError(msg) {
  errors++;
  console.log(`\x1b[31m✖\x1b[0m ${msg}`);
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

console.log('\n--- Dossier UI Pre-Publish Preflight Check ---\n');

// 1. Root License
if (await fileExists('LICENSE')) {
  logSuccess('Root LICENSE file exists');
} else {
  logError('Root LICENSE file is missing');
}

// 2. Inspect each package
for (const pkg of PACKAGES) {
  const pkgDir = resolve(`packages/${pkg}`);
  const pkgJsonPath = resolve(pkgDir, 'package.json');
  console.log(`\nChecking package: packages/${pkg}`);

  if (!(await fileExists(pkgJsonPath))) {
    logError(`Missing package.json in ${pkgDir}`);
    continue;
  }

  let pkgJson;
  try {
    pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf8'));
  } catch (err) {
    logError(`Invalid JSON in ${pkgJsonPath}: ${err.message}`);
    continue;
  }

  // Required fields
  if (pkgJson.name) logSuccess(`name: ${pkgJson.name}`);
  else logError(`Missing "name" field`);

  if (pkgJson.version) logSuccess(`version: ${pkgJson.version}`);
  else logError(`Missing "version" field`);

  if (pkgJson.description) logSuccess(`description: ${pkgJson.description}`);
  else logWarn(`Missing or empty "description" field`);

  if (pkgJson.license === 'MIT') logSuccess(`license: ${pkgJson.license}`);
  else logError(`License should be "MIT" (found: ${pkgJson.license})`);

  if (pkgJson.publishConfig?.access === 'public') {
    logSuccess('publishConfig.access is "public"');
  } else {
    logError('publishConfig.access MUST be "public" for scoped npm packages');
  }

  if (pkgJson.repository?.url) {
    logSuccess(`repository: ${pkgJson.repository.url}`);
  } else {
    logWarn(`Missing "repository" field`);
  }

  // Check README.md
  const readmePath = resolve(pkgDir, 'README.md');
  if (await fileExists(readmePath)) {
    logSuccess('README.md exists');
  } else {
    logError(`README.md missing in packages/${pkg}`);
  }

  // Check LICENSE
  const licensePath = resolve(pkgDir, 'LICENSE');
  if (await fileExists(licensePath)) {
    logSuccess('LICENSE exists');
  } else {
    logError(`LICENSE missing in packages/${pkg}`);
  }

  // Check built artifacts in dist/
  const distDir = resolve(pkgDir, 'dist');
  if (!(await fileExists(distDir))) {
    logError(`dist/ directory missing in packages/${pkg} (run 'pnpm build:packages')`);
  } else {
    // Check main or exports targets
    const entryPoints = [];
    if (pkgJson.main) entryPoints.push(resolve(pkgDir, pkgJson.main));
    if (pkgJson.types) entryPoints.push(resolve(pkgDir, pkgJson.types));
    if (pkgJson.style) entryPoints.push(resolve(pkgDir, pkgJson.style));

    for (const entry of entryPoints) {
      if (await fileExists(entry)) {
        logSuccess(`Target exists: ${entry.replace(resolve('.'), '')}`);
      } else {
        logError(`Target missing on disk: ${entry.replace(resolve('.'), '')}`);
      }
    }
  }
}

console.log('\n----------------------------------------------');
if (errors > 0) {
  console.log(`\x1b[31mPreflight failed with ${errors} error(s) and ${warnings} warning(s).\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32mAll preflight checks passed! (${warnings} warnings)\x1b[0m\n`);
  process.exit(0);
}
