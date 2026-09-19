import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { aliases } from '../../vite.shared';
export default defineConfig({ root: fileURLToPath(new URL('.', import.meta.url)), plugins: [react()], resolve: { alias: aliases }, server: { port: 5174, fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] } }, build: { outDir: 'dist', emptyOutDir: true } });
