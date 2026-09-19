# @dossier-ui/tokens

Design tokens, CSS variables, and TypeScript definitions for Dossier UI technical interfaces.

[![npm version](https://img.shields.io/npm/v/@dossier-ui/tokens.svg)](https://www.npmjs.com/package/@dossier-ui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install @dossier-ui/tokens
# or
pnpm add @dossier-ui/tokens
```

---

## Usage

### 1. In JavaScript / TypeScript

Import strongly typed tokens directly in your scripts or component styling:

```ts
import { colors, spacing, typography, density, zIndex } from '@dossier-ui/tokens';

console.log(spacing[4]); // 16px
console.log(colors.paper.bg); // #f4efe6
console.log(typography.fontMono);
```

### 2. In CSS / Vanilla Web

Import the token stylesheet to inject all `--dossier-*` custom properties:

```css
@import '@dossier-ui/tokens/styles.css';

.custom-panel {
  background-color: var(--dossier-surface-bg);
  border: 1px solid var(--dossier-border-default);
  padding: var(--dossier-space-4);
  font-family: var(--dossier-font-mono);
}
```

Or via JavaScript import:

```ts
import '@dossier-ui/tokens/styles.css';
```

---

## Token Categories

- **Typography**: Monospace font stacks, font weights (400, 500, 600, 700), font sizes, and line heights.
- **Spacing**: Predictable 4px grid scale (`0` through `12`).
- **Colors**: Both `paper` and `dark` theme surfaces, borders, text, and semantic tones (`info`, `success`, `warning`, `danger`).
- **Density**: Row height, padding, and font-size scalings for `compact`, `default`, and `comfortable`.
- **Z-Index**: Predictable layering for drawers, dialogs, dropdowns, and tooltips.

---

## License

MIT © [Dossier UI Contributors](https://github.com/dossier-ui/dossier-ui)
