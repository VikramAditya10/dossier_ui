import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

let otp = process.argv.slice(2).find((arg) => !arg.startsWith('-')) || 
          process.argv.slice(2).find((arg) => arg.startsWith('--otp='))?.split('=')[1];

function runPublish(otpCode) {
  const args = ['-r', 'publish', '--access', 'public', '--no-git-checks'];
  if (otpCode) {
    args.push(`--otp=${otpCode}`);
  }
  return spawnSync('pnpm', args, {
    stdio: 'inherit',
    shell: true,
  });
}

console.log('\nPublishing 4 Dossier UI packages to npmjs...\n');

// 1. If OTP was provided as argument, publish with it
if (otp) {
  console.log(`Using provided OTP: ${otp}`);
  const result = runPublish(otp);
  process.exit(result.status ?? 0);
}

// 2. Otherwise try publishing directly (works with Granular Token / 2FA bypass)
const attempt = runPublish();
if (attempt.status === 0) {
  console.log('\n✔ All packages published successfully to https://www.npmjs.com!\n');
  process.exit(0);
}

// 3. If it failed and might need OTP, prompt the user
console.log('\nDirect publish did not complete. If your account requires an interactive 2FA OTP:');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptedOtp = await new Promise((resolve) => {
  rl.question('Enter your 6-digit npm 2FA OTP code (or press Enter to cancel): ', (answer) => {
    rl.close();
    resolve(answer.trim());
  });
});

if (!promptedOtp) {
  process.exit(attempt.status ?? 1);
}

const retry = runPublish(promptedOtp);
if (retry.status === 0) {
  console.log('\n✔ All packages published successfully to https://www.npmjs.com!\n');
}
process.exit(retry.status ?? 0);
