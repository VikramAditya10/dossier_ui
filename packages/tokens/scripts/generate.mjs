import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { colors, darkColors, typography, spacing, radii, motion, zIndex, density } from '../src/tokens.ts';

const kebab = (value) => value.replace(/([a-z])([0-9])/g, '$1-$2').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const declarations = (values, prefix = '') => Object.entries(values).map(([key, value]) => `  --dossier-${prefix}${kebab(key)}: ${value};`).join('\n');
const section = (selector, ...values) => `${selector} {\n${values.join('\n')}\n}\n`;
const css = [
  '/* Generated from tokens.ts. Run pnpm tokens:generate; do not edit by hand. */',
  section(':root, [data-dossier-theme="paper"]', declarations(colors), declarations(typography), declarations(spacing, 'space-'), declarations(radii, 'radius-'), declarations(motion, 'transition-'), declarations(zIndex, 'z-'), declarations(density.default), '  color-scheme: light;'),
  section('[data-dossier-theme="dark"]', declarations(darkColors), '  color-scheme: dark;'),
  ...Object.entries(density).map(([name, values]) => section(`[data-dossier-density="${name}"]`, declarations(values))),
].join('\n');
writeFileSync(fileURLToPath(new URL('../src/tokens.css', import.meta.url)), css);
