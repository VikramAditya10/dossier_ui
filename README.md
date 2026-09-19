# Dossier UI

A React and CSS framework for technical interfaces: monospace typography, paper surfaces, dense tables, indexed sections, and sharp rules. Built from [the project brief](./Dossier_UI_Framework_Agent_Instructions.md).

[![npm version](https://img.shields.io/npm/v/@vikramaditya1010/react.svg)](https://www.npmjs.com/package/@vikramaditya1010/react)
[![Live Documentation](https://img.shields.io/badge/Live%20Docs-GitHub%20Pages-274c77)](https://vikramaditya10.github.io/dossier_ui/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

🌐 **Live Documentation & Component Explorer:**  
**[https://vikramaditya10.github.io/dossier_ui/](https://vikramaditya10.github.io/dossier_ui/)**

---
## Run and view the documentation

Use **Node.js 22.18+** and **pnpm 10+**. From this directory:

```powershell
pnpm install
pnpm dev
```

Open **http://127.0.0.1:5173**. If that port is occupied, Vite prints the port it selected. The documentation includes search (`Ctrl/Cmd + K`), interactive component examples, source snippets, API tables, paper/dark themes, density settings, and a sample event dashboard.

```powershell
pnpm dev:playground  # Standalone Relay dashboard: http://127.0.0.1:5174
pnpm storybook      # Component workbench: http://localhost:6006
```

## Workspace

```text
apps/docs/                  Documentation application
apps/playground/            Interactive Relay dashboard
packages/tokens/            TypeScript tokens and generated theme CSS
packages/core/              Scoped base CSS and utilities
packages/react/             React components, styles, stories, and tests
packages/icons/             Small SVG icon wrapper
examples/analytics-dashboard/  Consumer of built package exports
examples/admin-dashboard/      Consumer of built package exports
tests/e2e/                  Desktop, mobile, accessibility, visual checks
```

The React package uses component families (`foundations`, `data`, `application`) to keep closely related APIs together. Styles and tests are colocated with those families.

## Use in another React app

This is a **local development release**. Packages have not been published to a registry.

```powershell
pnpm build:packages
pnpm --dir packages/react pack
# In the consuming application, adjust the archive path:
pnpm add /path/to/dossier-ui-react-0.1.0.tgz
```

Once you publish your packages, the corresponding install command is `pnpm add @dossier-ui/react`. React and React DOM 18.3+ are peer dependencies. The CSS bundle includes tokens and core styles; no Tailwind or CSS-in-JS runtime is required.

```tsx
import {
  DossierProvider,
  DocumentHeader,
  MetricRow,
  Button,
} from '@dossier-ui/react';
import '@dossier-ui/react/styles.css';

export function App() {
  return (
    <DossierProvider theme="paper" density="default">
      <DocumentHeader
        kicker="RELAY / EVENT INFRASTRUCTURE"
        title="EVENT DELIVERY CONTROL PLANE"
        metadata={[
          ['ENV', 'PROD'],
          ['REGION', 'AP-SOUTH-1'],
        ]}
      />
      <MetricRow label="EVENTS PROCESSED" value="12,482" tone="success" />
      <Button variant="solid">Deploy changes</Button>
    </DossierProvider>
  );
}
```

## Themes, density, and tokens

Use a `DossierProvider` to scope theme and density to an application, or set the attributes on your HTML element:

```html
<html data-dossier-theme="dark" data-dossier-density="compact">
```

Themes: `paper`, `dark`. Densities: `compact`, `default`, `comfortable`.

All CSS custom properties start with `--dossier-`; all library classes start with `ds-`. Fonts use a monospace fallback stack, so no proprietary or externally hosted fonts are required.

```css
.my-application {
  --dossier-accent-blue: #274c77;
  --dossier-font-mono: 'Your Mono Font', monospace;
}
```

Independent token usage after installing/packing `@dossier-ui/tokens`:

```ts
import { colors, spacing, typography } from '@dossier-ui/tokens';
import '@dossier-ui/tokens/styles.css';
```

Edit `packages/tokens/src/tokens.ts`, then run `pnpm tokens:generate`. Generated CSS must not be edited by hand. Small-text colors are adjusted slightly from the original brief for readable contrast.

## Data tables

```tsx
<DataTable
  columns={[
    { key: 'id', header: 'EVENT ID', sortable: true },
    { key: 'provider', header: 'PROVIDER', sortable: true },
    { key: 'latency', header: 'LATENCY', numeric: true, sortable: true },
  ]}
  rows={events}
  getRowId={(event) => event.id}
  selectable
  numbered
  pagination
  pageSize={10}
/>
```

Use stable identifiers when selecting rows. Sort headers with Enter/Space; move between focused rows with Up/Down/Home/End; toggle a focused selectable row with Space. Selection can be controlled using `selectedKeys` and `onSelectionChange`. Tables scroll horizontally on small screens. Pagination and sorting are local; server-side data fetching and virtualization remain application concerns.

## Verification and builds

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build:storybook
pnpm exec playwright install chromium
pnpm test:e2e
```

The build emits ESM JavaScript, source maps, declarations, declaration maps, and a standalone CSS bundle. `pnpm build` also compiles both example consumer apps against the actual package exports. `packages/core/dist/styles.css` is monitored against the brief's 25 KB gzip target.

Visual checks cover paper, dark, and compact table layouts. Initial baselines were generated with Chromium on Windows. If deliberately changing the design or running on a different rendering platform, review and update baselines with `pnpm test:visual --update-snapshots`. Do not accept snapshot changes without visual review.

To use an existing Chromium installation in restricted environments, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to the browser executable before running tests. Test screenshots and traces are written to `test-results/`; the HTML report is at `playwright-report/index.html`.

## Accessibility and browser support

Components use semantic controls, associated labels/errors, visible keyboard focus, native modal dialogs, keyboard tab navigation, and reduced-motion support. Automated axe checks and interaction tests cover representative flows. This is not a blanket accessibility certification: consuming applications must provide meaningful labels and verify their actual content and custom colors.

Targets modern Chrome/Edge, Firefox, and Safari with support for native `dialog`, CSS variables, and `color-mix()`. Chromium is covered by the included browser suite; other engines require project-specific validation. The library can render on the server; clipboard actions and dialogs run only in browser interactions/effects.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Keep components compact and composable. Use typography, rules, and metadata to establish hierarchy. Add meaningful tests for interactive behavior and a Storybook example for new components.
