import { fileURLToPath } from 'node:url';
export const aliases = {
  '@dossier-ui/react/styles.css': fileURLToPath(new URL('./packages/react/src/styles.css', import.meta.url)),
  '@dossier-ui/react': fileURLToPath(new URL('./packages/react/src/index.ts', import.meta.url)),
  '@dossier-ui/tokens': fileURLToPath(new URL('./packages/tokens/src/index.ts', import.meta.url)),
  '@dossier-ui/icons': fileURLToPath(new URL('./packages/icons/src/index.tsx', import.meta.url)),
  '@vikramaditya1010/react/styles.css': fileURLToPath(new URL('./packages/react/src/styles.css', import.meta.url)),
  '@vikramaditya1010/react': fileURLToPath(new URL('./packages/react/src/index.ts', import.meta.url)),
  '@vikramaditya1010/tokens': fileURLToPath(new URL('./packages/tokens/src/index.ts', import.meta.url)),
  '@vikramaditya1010/icons': fileURLToPath(new URL('./packages/icons/src/index.tsx', import.meta.url)),
};
