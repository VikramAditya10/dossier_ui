# @dossier-ui/core

Scoped CSS foundations, monospace typography, architectural resets, and utility classes for Dossier UI technical interfaces.

[![npm version](https://img.shields.io/npm/v/@dossier-ui/core.svg)](https://www.npmjs.com/package/@dossier-ui/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install @dossier-ui/core
# or
pnpm add @dossier-ui/core
```

---

## Usage

Include `@dossier-ui/core/styles.css` in your HTML, CSS, or JS bundle:

```css
@import '@dossier-ui/core/styles.css';
```

Or in JavaScript/TypeScript:

```ts
import '@dossier-ui/core/styles.css';
```

---

## Highlights

- **Ultra-Compact Bundle**: Includes token definitions and base layout rules in < 25 KB gzipped.
- **Strictly Scoped**: All utility classes are namespaced under `.ds-*` to prevent collisions with existing application styles.
- **Monospace Reset**: Standardizes browser inputs, buttons, tables, and typography around crisp monospace proportions.
- **Theme & Density Attributes**: Supports `data-dossier-theme="paper|dark"` and `data-dossier-density="compact|default|comfortable"`.

---

## License

MIT © [Dossier UI Contributors](https://github.com/dossier-ui/dossier-ui)
