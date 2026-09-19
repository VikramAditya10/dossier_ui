import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const newScope = process.argv[2]?.trim();

if (!newScope) {
  console.log(`
Usage:
  node scripts/set-scope.mjs <@new-scope>

Example:
  node scripts/set-scope.mjs @my-npm-username
  node scripts/set-scope.mjs @my-org

This updates package names and dependencies across packages/, apps/, and examples/.
`);
  process.exit(1);
}

const formattedScope = newScope.startsWith('@') ? newScope : `@${newScope}`;

async function findPackageJsons() {
  const files = ['package.json'];
  for (const group of ['packages', 'apps', 'examples']) {
    try {
      const entries = await readdir(resolve(group), { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          files.push(`${group}/${entry.name}/package.json`);
        }
      }
    } catch {
      // directory might not exist
    }
  }
  return files;
}

const files = await findPackageJsons();
let updatedCount = 0;

for (const relPath of files) {
  const filePath = resolve(relPath);
  try {
    const raw = await readFile(filePath, 'utf8');
    const json = JSON.parse(raw);
    let modified = false;

    // 1. Update package name
    if (json.name && json.name.startsWith('@') && json.name.includes('/')) {
      const [oldScope, pkgName] = json.name.split('/');
      const newName = `${formattedScope}/${pkgName}`;
      if (json.name !== newName) {
        json.name = newName;
        modified = true;
      }
    }

    // 2. Update dependencies
    for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!json[depType]) continue;
      for (const [depName, version] of Object.entries(json[depType])) {
        if (depName.startsWith('@') && depName.includes('/')) {
          const [, pkgName] = depName.split('/');
          const newDepName = `${formattedScope}/${pkgName}`;
          if (depName !== newDepName && ['core', 'tokens', 'icons', 'react'].includes(pkgName)) {
            delete json[depType][depName];
            json[depType][newDepName] = version;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await writeFile(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
      console.log(`Updated ${relPath}`);
      updatedCount++;
    }
  } catch (err) {
    // Skip if missing
  }
}

console.log(`\nScope updated to "${formattedScope}" in ${updatedCount} package.json files.`);
