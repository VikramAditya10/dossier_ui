import type { StorybookConfig } from '@storybook/react-vite';
import { aliases } from '../vite.shared';
const config: StorybookConfig = { stories: ['../packages/react/src/**/*.stories.tsx'], framework: '@storybook/react-vite', addons: [], async viteFinal(config) { config.resolve = { ...config.resolve, alias: { ...config.resolve?.alias, ...aliases } }; return config; } };
export default config;
