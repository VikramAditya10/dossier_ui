import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { aliases } from './vite.shared';
export default defineConfig({ plugins: [react()], resolve: { alias: aliases }, test: { environment: 'jsdom', globals: true, setupFiles: ['./tests/setup.ts'], include: ['packages/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'] } });
