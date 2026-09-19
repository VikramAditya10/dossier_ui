# @dossier-ui/react

A React and CSS component library designed for dense, technical interfaces: paper surfaces, monospace typography, high-density data tables, telemetry rows, and sharp architectural rules.

[![npm version](https://img.shields.io/npm/v/@dossier-ui/react.svg)](https://www.npmjs.com/package/@dossier-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Installation

Install `@dossier-ui/react` along with its peer dependencies:

```bash
npm install @dossier-ui/react react react-dom
# or
pnpm add @dossier-ui/react react react-dom
# or
yarn add @dossier-ui/react react react-dom
```

> **Requirements**: React 18.0+ or React 19+.

---

## Quick Start

Import the CSS stylesheet once at your application root (e.g. `main.tsx` or `App.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  DossierProvider,
  DocumentHeader,
  MetricRow,
  DataTable,
  Button,
  Status,
} from '@dossier-ui/react';
import '@dossier-ui/react/styles.css';

function App() {
  const events = [
    { id: 'EVT-9041', provider: 'stripe.webhook', status: 'delivered', latency: '42ms' },
    { id: 'EVT-9042', provider: 'aws.sqs', status: 'queued', latency: '18ms' },
  ];

  return (
    <DossierProvider theme="paper" density="default">
      <DocumentHeader
        kicker="INFRASTRUCTURE / RELAY"
        title="EVENT DELIVERY CONTROL PLANE"
        metadata={[
          ['ENV', 'PRODUCTION'],
          ['REGION', 'US-EAST-1'],
          ['STATUS', 'ONLINE'],
        ]}
      />

      <MetricRow label="EVENTS PROCESSED" value="1,248,930" tone="success" />

      <DataTable
        columns={[
          { key: 'id', header: 'EVENT ID', sortable: true },
          { key: 'provider', header: 'SOURCE', sortable: true },
          {
            key: 'status',
            header: 'STATUS',
            render: (val) => (
              <Status tone={val === 'delivered' ? 'success' : 'warning'}>
                {String(val).toUpperCase()}
              </Status>
            ),
          },
          { key: 'latency', header: 'LATENCY', numeric: true },
        ]}
        rows={events}
        getRowId={(row) => row.id}
        selectable
      />

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <Button variant="solid">Deploy Configuration</Button>
        <Button variant="outline">Inspect Logs</Button>
      </div>
    </DossierProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

---

## Themes & Density

Wrap your tree in `DossierProvider` or apply data attributes to the `<html>` or container element:

```html
<html data-dossier-theme="dark" data-dossier-density="compact">
```

- **Themes**:
  - `paper` (Warm editorial / technical documentation tone)
  - `dark` (Deep terminal / control plane tone)
- **Densities**:
  - `compact` (Ultra-dense telemetry & log tables)
  - `default` (Balanced technical interfaces)
  - `comfortable` (Relaxed reading mode)

---

## Component Catalog

### 1. Foundations
- **Layout & Structure**: `DossierProvider`, `Container`, `Stack`, `Inline`, `Cluster`, `Split`, `Grid`, `Document`, `Section`, `Rule`.
- **Typography**: `Display`, `Heading`, `Subheading`, `Body`, `Label`, `Meta`, `Caption`, `Code`, `Number`.
- **Actions & Indicators**: `Button`, `IconButton`, `ButtonGroup`, `Status`, `Tag`, `Metric`, `MetricRow`, `MetricGroup`, `Metadata`, `DocumentHeader`.
- **Form Controls**: `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `SearchInput`, `NumberInput`.

### 2. Data & Telemetry
- `DataTable`: Monospace data grid with sorting, row selection, pagination, and keyboard navigation.
- `Pagination`: Segmented page controls.
- `Figure` & `Annotation`: Labeled diagrams and data callouts.
- `CodeBlock`: Syntax-styled monospace code box with copy button and line numbers.
- `LogViewer`: Streaming / static log window with timestamps and wrapping.
- `JSONViewer`: Formatted JSON tree viewer.
- `KeyValue` & `KeyValueList`: Grid and list key-value pairs.
- `AuditTimeline`: Chronological audit and event trail.
- `Progress` & `Meter`: Gauges and progress indicators.
- `ChartFrame`, `ChartHeader`, `ChartLegend`, `ChartTooltip`: Framework for charts and graphs.
- `EmptyState`, `SkeletonText`, `SkeletonRow`, `TableSkeleton`, `InlineLoader`: Loading and placeholder states.

### 3. Application Frame
- `Tabs`: Segmented tabbed views (`Tabs`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`).
- `Sidebar`, `NavGroup`, `NavItem`: Navigation sidebars.
- `Breadcrumb`: Monospace hierarchy path navigation.
- `TopBar`: Brand header with actions bar.
- `Dialog` & `ConfirmDialog`: Native modal dialogs with accessible focus trapping.
- `Drawer`: Slide-over inspection drawer for deep inspection.
- `Toast`, `ToastProvider`, `useToast`: Notification toasts.
- `Tooltip`: Monospace hover tooltips.
- `Callout`: Highlighted technical notices with tone borders.

---

## CSS Variables & Styling

All library classes use the `.ds-` prefix, and tokens use the `--dossier-` CSS variable namespace:

```css
:root {
  --dossier-font-mono: 'JetBrains Mono', 'Fira Code', Menlo, monospace;
  --dossier-accent-blue: #274c77;
}
```

The compiled CSS bundle (`@dossier-ui/react/styles.css`) is self-contained and does not require Tailwind, PostCSS, or CSS-in-JS runtimes.

---

## License

MIT © [Dossier UI Contributors](https://github.com/dossier-ui/dossier-ui)
