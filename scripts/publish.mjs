import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

let otp = process.argv.slice(2).find((arg) => !arg.startsWith('-')) || 
          process.argv.slice(2).find((arg) => arg.startsWith('--otp='))?.split('=')[1];

if (!otp) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  otp = await new Promise((resolve) => {
    rl.question('\nEnter your 6-digit npm 2FA OTP code: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

if (!otp) {
  console.error('\nError: 2FA OTP code is required to publish.');
  process.exit(1);
}

console.log(`\nPublishing 4 Dossier UI packages to npmjs with OTP: ${otp}...\n`);
const result = spawnSync('pnpm', ['-r', 'publish', '--access', 'public', '--no-git-checks', `--otp=${otp}`], {
  stdio: 'inherit',
  shell: true,
});

if (result.status === 0) {
  console.log('\n✔ All packages published successfully to https://www.npmjs.com!\n');
}

process.exit(result.status ?? 0);
