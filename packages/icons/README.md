# @dossier-ui/icons

Crisp, monospace and technical SVG icons for Dossier UI applications and data consoles.

[![npm version](https://img.shields.io/npm/v/@dossier-ui/icons.svg)](https://www.npmjs.com/package/@dossier-ui/icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install @dossier-ui/icons react
# or
pnpm add @dossier-ui/icons react
```

---

## Usage

```tsx
import { Icon, iconNames } from '@dossier-ui/icons';

function StatusPanel() {
  return (
    <div>
      <Icon name="terminal" size={16} />
      <span>System Terminal</span>
      <Icon name="check" size={14} label="Online status" />
    </div>
  );
}
```

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `IconName` | *(required)* | Name of the icon to render (e.g. `'terminal'`, `'search'`, `'copy'`). |
| `size` | `number \| string` | `16` | Width and height in pixels or CSS units. |
| `label` | `string` | `undefined` | Accessible description. When omitted, icon is rendered `aria-hidden="true"`. |
| `className` | `string` | `undefined` | Additional class name (`.ds-icon` is automatically applied). |

### Available Icons (`iconNames`)
- `arrow-right`
- `arrow-up-right`
- `chevron-down`
- `chevron-right`
- `search`
- `sun`
- `moon`
- `copy`
- `check`
- `close`
- `menu`
- `code`
- `external`
- `plus`
- `settings`
- `grid`
- `file`
- `terminal`
- `github`

---

## License

MIT © [Dossier UI Contributors](https://github.com/dossier-ui/dossier-ui)
