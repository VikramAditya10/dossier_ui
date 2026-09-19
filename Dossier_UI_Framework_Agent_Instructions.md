# Dossier UI Framework — Coding Agent Build Instructions

## 1. Objective

Build a reusable, production-quality UI/CSS framework inspired by a **technical research dossier / intelligence report / archival terminal printout** aesthetic.

The framework must be suitable for:
- Admin dashboards
- Analytics applications
- Event monitoring
- Audit trails
- Observability tooling
- AI/ML interfaces
- Developer tools
- Internal enterprise applications
- Data-heavy applications

The visual direction should feel like:

> Research paper + intelligence dossier + engineering schematic + Bloomberg-style data density.

Do **not** build a generic Tailwind/SaaS design system.

The framework must have a distinctive identity built around:
- Monospace typography
- Dense information layouts
- Strong horizontal rules
- Tables
- Metadata labels
- Figure captions
- Indexed sections
- Mechanical controls
- Limited accent colors
- Near-zero border radius
- No decorative shadows

---

# 2. Working Name

Use the temporary package name:

`dossier-ui`

The codebase should be structured so the package name can easily be changed later.

Suggested package names that may be used in demos/documentation:
- Dossier UI
- Archive UI
- Signal UI
- Plate UI
- Fieldnote UI

Use **Dossier UI** in code comments and Storybook/demo documentation for now.

---

# 3. Technology Decisions

Use the following stack unless the existing repository already establishes a compatible equivalent.

## Required

- TypeScript
- React
- CSS variables
- CSS Modules or vanilla CSS for component styles
- Vite for package/demo development
- Storybook for component documentation
- Vitest for unit tests
- React Testing Library for component tests
- Playwright for visual/e2e testing
- ESLint
- Prettier

## Package outputs

The library must support:

```ts
import { Button, DataTable, MetricRow, Figure } from "@dossier-ui/react";
```

and:

```ts
import "@dossier-ui/react/styles.css";
```

Also expose design tokens independently:

```ts
import "@dossier-ui/tokens";
```

Do not require Tailwind at runtime.

Tailwind compatibility can be added later as an optional package.

---

# 4. Monorepo Structure

Create the project using a workspace structure.

Recommended:

```text
dossier-ui/
├── apps/
│   ├── docs/
│   └── playground/
│
├── packages/
│   ├── tokens/
│   ├── core/
│   ├── react/
│   └── icons/
│
├── examples/
│   ├── analytics-dashboard/
│   └── admin-dashboard/
│
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

Responsibilities:

```text
packages/tokens
    colors
    typography
    spacing
    borders
    radii
    motion
    z-index

packages/core
    raw CSS classes
    layout utilities
    typography utilities
    base/reset styles

packages/react
    React components

packages/icons
    optional icon set or wrappers
```

---

# 5. Core Design Philosophy

Every design decision should be evaluated against these principles.

## 5.1 Data first

The interface exists to communicate information.

Decorative styling must never interfere with data density or readability.

Prefer:

```text
LABEL                               VALUE
────────────────────────────────────────
TOTAL EVENTS                       12,482
FAILED                                124
LATENCY P95                         420ms
```

over large floating cards.

---

## 5.2 Lines instead of cards

Use:
- Horizontal separators
- Thin borders
- Section rules
- Figure frames

Avoid:
- Elevated cards
- Box shadows
- Floating panels
- Soft SaaS containers

Default card shadow:

```css
box-shadow: none;
```

---

## 5.3 Monospace identity

The default UI should strongly favor monospace typography.

Font stack:

```css
--font-mono:
  "IBM Plex Mono",
  "JetBrains Mono",
  "Roboto Mono",
  "SFMono-Regular",
  Consolas,
  "Liberation Mono",
  monospace;
```

Do not bundle proprietary font files.

Allow consumers to override the font.

---

## 5.4 Dense but readable

The framework should support compact information-dense layouts.

Default component density should be smaller than Bootstrap, Material UI or typical Tailwind dashboards.

Provide density modes:

```text
compact
default
comfortable
```

---

## 5.5 Minimal curvature

Default radius:

```css
--radius-xs: 1px;
--radius-sm: 2px;
--radius-md: 3px;
```

Do not use pill-shaped controls except where semantically necessary.

---

## 5.6 Limited color vocabulary

Primary palette:

```css
--paper: #f2f0e9;
--paper-muted: #e8e5dc;

--ink: #242321;
--ink-soft: #4c4943;
--ink-muted: #77736c;

--rule: #403e39;
--rule-light: #c8c4b9;

--accent-red: #a9473f;
--accent-blue: #355d91;
--accent-green: #477b59;
--accent-amber: #94702d;
```

Color must communicate meaning rather than decoration.

Suggested semantics:

```text
red     error / denied / destructive
blue    technical / informational
green   success / accepted / positive
amber   warning / pending
gray    metadata / inactive
black   primary information
```

---

# 6. Theme System

Implement theme support using CSS variables.

Required themes:

```text
paper
dark
```

Paper theme is the default.

Example:

```html
<html data-dossier-theme="paper">
```

and:

```html
<html data-dossier-theme="dark">
```

Consumers must be able to override any token.

Example:

```css
:root {
  --dossier-accent-blue: #274c77;
}
```

Prefix all CSS custom properties with:

```text
--dossier-
```

Example:

```css
--dossier-paper
--dossier-ink
--dossier-space-2
```

---

# 7. Typography System

Build a complete typography scale.

Required semantic classes/components:

```text
Display
Heading
Subheading
Body
Label
Meta
Caption
Code
Number
```

Suggested scale:

```css
--text-2xs: 0.625rem;
--text-xs: 0.6875rem;
--text-sm: 0.75rem;
--text-md: 0.875rem;
--text-lg: 1rem;
--text-xl: 1.25rem;
--text-2xl: 1.625rem;
--text-3xl: 2rem;
```

Typography behavior:

### Display / Heading
- Bold
- Uppercase supported
- Tight line height
- Slight positive tracking

### Metadata
- 9–11px equivalent
- Uppercase
- Increased letter spacing
- Muted color

Example:

```text
PROJECT RELAY / PROD / AP-SOUTH-1 / REV 03
```

### Numeric text
Use:

```css
font-variant-numeric: tabular-nums;
```

for all table and metric numeric values.

---

# 8. Spacing System

Create a restrained spacing scale.

Example:

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

Default padding should be compact.

Avoid excessive 32–48px card padding.

---

# 9. Layout System

Implement layout utilities/components.

Required:

```text
Container
Stack
Inline
Grid
Cluster
Split
Section
Document
```

Support 12-column grid layouts.

Example:

```tsx
<Grid columns={12}>
  <Grid.Item span={8}>...</Grid.Item>
  <Grid.Item span={4}>...</Grid.Item>
</Grid>
```

Responsive behavior must remain practical on:
- Desktop
- Tablet
- Mobile

Dense tables should support horizontal scrolling on small screens.

---

# 10. Rule / Separator Component

Create a signature `Rule` component.

API:

```tsx
<Rule />
<Rule weight="heavy" />
<Rule variant="dashed" />
<Rule label="SECTION 03" />
```

Variants:

```text
thin
heavy
double
dashed
dotted
```

Example output:

```text
SECTION 03 ──────────────────────────────────────────
```

---

# 11. Document Header

Build a `DocumentHeader` component.

Example:

```tsx
<DocumentHeader
  kicker="RELAY / COMMUNICATION INFRASTRUCTURE"
  title="EVENT DELIVERY CONTROL PLANE"
  metadata={[
    ["ENV", "PROD"],
    ["TENANT", "SMARTBUY"],
    ["REGION", "AP-SOUTH-1"],
    ["REV", "17"],
  ]}
/>
```

Expected visual:

```text
RELAY / COMMUNICATION INFRASTRUCTURE

EVENT DELIVERY CONTROL PLANE
────────────────────────────────────────────────────
ENV PROD   TENANT SMARTBUY   REGION AP-SOUTH-1   REV 17
```

---

# 12. Section Component

Required API:

```tsx
<Section
  index="03"
  title="Provider Health"
  description="Delivery performance across configured providers."
>
  ...
</Section>
```

Variants:

```text
plain
ruled
numbered
compact
```

The section index must be visually distinctive.

---

# 13. Metadata Component

Build reusable metadata groups.

Example:

```tsx
<Metadata
  items={[
    { label: "PROJECT", value: "RELAY" },
    { label: "REV", value: "03" },
    { label: "DATE", value: "SEP 2026" },
    { label: "PLATE", value: "03 / 12" },
  ]}
/>
```

Support:

```text
inline
stacked
distributed
```

---

# 14. Metric Components

Create both:

```text
Metric
MetricRow
MetricGroup
```

Example:

```tsx
<MetricRow
  label="EVENTS PROCESSED"
  description="LAST 24 HOURS"
  value="12,482"
  tone="green"
/>
```

Output should resemble:

```text
EVENTS PROCESSED                              12,482
LAST 24 HOURS
────────────────────────────────────────────────────
```

Metric values:
- large
- tabular numeric
- optionally colored

Support trend indicators without requiring graphical arrows.

Example:

```text
12,482  +4.6%
```

---

# 15. Data Table

This is a critical component.

Build a high-quality `DataTable`.

Required features:

- Compact rows
- Sticky header
- Sortable columns
- Optional selectable rows
- Hover state
- Selected row
- Numeric alignment
- Column alignment
- Truncation
- Tooltips for overflow
- Responsive horizontal scrolling
- Keyboard navigation
- Loading state
- Empty state
- Pagination
- Optional row numbering
- Optional striped rows
- Optional grid mode
- Semantic status colors

Example:

```tsx
<DataTable
  density="compact"
  numbered
  columns={[
    { key: "agent", header: "AGENT" },
    { key: "sees", header: "SEES" },
    { key: "blind", header: "BLIND TO" },
    { key: "close", header: "CAN CLOSE" },
  ]}
  rows={rows}
/>
```

Default visual style:

```text
 AGENT       SEES           BLIND TO        CAN CLOSE
──────────────────────────────────────────────────────
 01 PROBE    volume.flow    the price       no
 02 PRISM    who paid       how big         no
 03 TALLY    size.volume    last result     no
 04 HATCH    price.chart    the entry       yes
```

Avoid thick vertical borders by default.

---

# 16. Status Component

Build:

```tsx
<Status tone="success">DELIVERED</Status>
<Status tone="danger">FAILED</Status>
<Status tone="warning">PENDING</Status>
<Status tone="info">QUEUED</Status>
```

The default appearance must be a rectangular technical label.

Example:

```text
[ DELIVERED ]
```

No pill styling by default.

---

# 17. Tag Component

API:

```tsx
<Tag>WARDEN</Tag>
<Tag tone="red">FAILED</Tag>
<Tag index="04">HATCH</Tag>
```

Variants:

```text
outline
filled
muted
technical
```

---

# 18. Button Component

Create:

```text
Button
IconButton
ButtonGroup
```

Default:

```text
[ SAVE CHANGES ]
```

API:

```tsx
<Button variant="outline">Save Changes</Button>
<Button variant="solid">Deploy</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Cancel</Button>
```

States:

```text
hover
active
focus
disabled
loading
```

Must have excellent visible keyboard focus.

Avoid rounded-pill buttons.

---

# 19. Form Components

Required:

```text
Field
Input
Textarea
Select
Checkbox
Radio
Switch
SearchInput
NumberInput
```

Field example:

```tsx
<Field
  label="TENANT ID"
  help="Immutable system identifier."
>
  <Input value="R360-SMARTBUY" />
</Field>
```

Default appearance:

```text
TENANT ID
┌────────────────────────────────┐
│ R360-SMARTBUY                  │
└────────────────────────────────┘
Immutable system identifier.
```

Support validation:

```text
default
success
warning
error
disabled
readonly
```

---

# 20. Tabs

Tabs should resemble document indexes rather than rounded application tabs.

Example:

```text
OVERVIEW   EVENTS   PROVIDERS   POLICIES   AUDIT
────────
```

API:

```tsx
<Tabs defaultValue="overview">
```

---

# 21. Navigation

Build optional navigation components:

```text
Sidebar
NavGroup
NavItem
Breadcrumb
TopBar
```

Sidebar styling:
- Flat
- Dense
- Monospace
- Section numbering supported
- No floating cards

Example:

```text
01  OVERVIEW
02  EVENTS
03  PROVIDERS
04  POLICIES
05  TEMPLATES
06  AUDIT
```

---

# 22. Figure Component

Create a signature `Figure` component.

API:

```tsx
<Figure
  index="01"
  title="EVENT DELIVERY GRAPH"
  stats={["1,210 EVENTS", "620 LINKS", "86 NODES"]}
  caption="Provider routing across tenant boundaries."
>
  <Graph />
</Figure>
```

Expected:

```text
FIGURE 01   EVENT DELIVERY GRAPH      1,210 EVENTS / 620 LINKS / 86 NODES
──────────────────────────────────────────────────────────────────────────

                           visualization

──────────────────────────────────────────────────────────────────────────
Provider routing across tenant boundaries.
```

---

# 23. Annotation Component

Create:

```tsx
<Annotation
  title="RETRY PATH"
  side="left"
>
  Provider retries are routed through the policy engine.
</Annotation>
```

Variants:

```text
left
right
top
bottom
```

Optional leader line support should be implemented using CSS/SVG without heavy dependencies.

---

# 24. Callout

Build:

```tsx
<Callout tone="info">
  Provider credentials rotate every 90 days.
</Callout>
```

Visual should resemble a technical margin note rather than a colorful alert card.

---

# 25. Code / Log Viewer

Because this design system targets technical interfaces, create:

```text
CodeBlock
LogViewer
KeyValue
JSONViewer
```

Log example:

```text
13:40:22.103  EVENT_ACCEPTED    evt_01J...
13:40:22.117  POLICY_MATCH      sms.default
13:40:22.220  PROVIDER_SENT     sinch
13:40:22.482  DELIVERED         362ms
```

Features:
- line numbers
- copy button
- selectable content
- wrap/no-wrap
- tone highlights
- virtualized rendering optional later

---

# 26. Timeline / Audit Trail

Create `AuditTimeline`.

Example:

```text
13:40:22.103  RECEIVED
       │
13:40:22.117  POLICY MATCHED
       │
13:40:22.220  PROVIDER SENT
       │
13:40:22.482  DELIVERED
```

API should accept:
- timestamp
- title
- description
- actor
- metadata
- tone

This is especially important for event-driven admin systems.

---

# 27. Key-Value Data

Build:

```tsx
<KeyValueList
  items={[
    ["TENANT", "SMARTBUY"],
    ["CHANNEL", "SMS"],
    ["PROVIDER", "SINCH"],
    ["LATENCY", "362ms"],
  ]}
/>
```

Support 1–4 columns.

---

# 28. Progress / Meter

Create a restrained progress component.

Example:

```text
DELIVERY RATE   [████████████████░░]  94.2%
```

Avoid bright gradients.

---

# 29. Chart Frame

Do not build a charting library.

Instead build presentation wrappers compatible with:
- Recharts
- ECharts
- D3
- Visx

Create:

```text
ChartFrame
ChartLegend
ChartTooltip
ChartHeader
```

Charts must inherit framework typography and colors.

---

# 30. Empty State

Empty states should remain minimal.

Example:

```text
NO EVENTS FOUND
────────────────────────
No events matched the current filters.

[ CLEAR FILTERS ]
```

Avoid illustrations by default.

---

# 31. Loading State

Provide:
- SkeletonText
- SkeletonRow
- TableSkeleton
- InlineLoader

Skeletons should be subtle and rectangular.

Do not use flashy shimmer by default.

---

# 32. Modal / Dialog

Create:

```text
Dialog
ConfirmDialog
Drawer
```

Keep borders sharp and technical.

Example:

```text
┌──────────────────────────────────────────────┐
│ DELETE PROVIDER                         [×] │
├──────────────────────────────────────────────┤
│                                              │
│ This will remove the provider configuration. │
│                                              │
├──────────────────────────────────────────────┤
│                         [ CANCEL ] [ DELETE ] │
└──────────────────────────────────────────────┘
```

---

# 33. Toast / Notifications

Provide notifications but maintain the visual language.

Example:

```text
[ SUCCESS ] Provider configuration saved.
```

Not floating glossy bubbles.

---

# 34. Tooltip

Tooltips should be:
- compact
- rectangular
- high contrast
- monospace

---

# 35. Icon System

Use a minimal icon dependency.

Recommended:
- Lucide React

Wrap icons behind an internal `Icon` component to avoid locking component APIs directly to Lucide.

Default stroke width should be restrained.

---

# 36. Accessibility Requirements

All components must meet WCAG 2.2 AA where applicable.

Required:
- semantic HTML
- proper labels
- keyboard navigation
- visible focus
- sufficient contrast
- ARIA where necessary
- reduced-motion support
- screen-reader labels
- no color-only state communication

Never sacrifice accessibility for aesthetic fidelity.

---

# 37. Motion

Animation must be minimal.

Default transition:

```css
--dossier-transition-fast: 120ms ease;
--dossier-transition-normal: 180ms ease;
```

Use motion only for:
- focus
- hover
- drawer opening
- dialog appearance
- state changes

Support:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 38. CSS Naming

Prefix raw CSS utility/component classes with:

```text
ds-
```

Examples:

```css
.ds-button
.ds-table
.ds-meta
.ds-figure
```

CSS variables:

```text
--dossier-*
```

Avoid global class names such as:

```text
.button
.card
.table
```

---

# 39. Component API Principles

React component APIs must be:

- predictable
- composable
- controlled/uncontrolled where appropriate
- type-safe
- accessible
- not excessively abstract

Prefer:

```tsx
<Button variant="outline" size="sm">
```

over configuration-heavy APIs.

Use polymorphic `asChild` or `as` only where it provides genuine value.

---

# 40. Variants

Create a common variant vocabulary.

## Size

```text
xs
sm
md
lg
```

## Density

```text
compact
default
comfortable
```

## Tone

```text
neutral
info
success
warning
danger
```

## Variant

```text
plain
outline
solid
muted
ghost
```

Reuse vocabulary consistently.

---

# 41. Utility Classes

Provide a small set of useful utilities.

Do not attempt to recreate Tailwind.

Required:

```text
text alignment
display
visually hidden
tabular numbers
uppercase
muted text
truncate
nowrap
scroll area
stack spacing
```

Example:

```css
.ds-tabular
.ds-uppercase
.ds-muted
.ds-sr-only
.ds-truncate
```

---

# 42. Demo Application

Build a complete example dashboard showing the framework in a realistic context.

Use a fictional event delivery platform.

Dashboard page:

```text
RELAY / EVENT INFRASTRUCTURE

EVENT DELIVERY CONTROL PLANE
────────────────────────────────────────────────────────────────────
ENV PROD   TENANT SMARTBUY   REGION AP-SOUTH-1   REV 17


EVENTS PROCESSED      DELIVERY RATE      FAILED        P95 LATENCY
12,482                98.7%              164           420ms


FIGURE 01   EVENT FLOW                         12,482 EVENTS / 4 PROVIDERS
────────────────────────────────────────────────────────────────────

                         event visualization

────────────────────────────────────────────────────────────────────


RECENT EVENTS
────────────────────────────────────────────────────────────────────

ID          CHANNEL    PROVIDER    STATUS       LATENCY
evt_001     SMS        SINCH       DELIVERED    314ms
evt_002     EMAIL      SES         DELIVERED    521ms
evt_003     WHATSAPP   META        FAILED       920ms
```

The demo should include:
- Sidebar
- Header
- Metrics
- Table
- Figure
- Audit timeline
- Form
- Dialog
- Tabs
- Tags
- Status labels
- Code/log viewer

---

# 43. Storybook

Every component must have Storybook stories.

Minimum stories:

```text
Default
All variants
All sizes
Disabled
Loading
Dark theme
Compact density
Long content
Accessibility edge cases
```

For tables:
- 5 rows
- 100 rows
- empty
- loading
- selected
- sortable

---

# 44. Tests

For each interactive component provide:

- render test
- keyboard test
- accessibility behavior test
- click/change test
- disabled state test

Critical components:
- Button
- Input
- Select
- Dialog
- Tabs
- DataTable
- Checkbox
- Radio
- Sidebar
- Pagination

Visual regression tests should cover:
- paper theme
- dark theme
- compact density

---

# 45. Performance

The library must:
- tree-shake correctly
- avoid large runtime dependencies
- avoid CSS-in-JS runtime overhead
- support SSR
- avoid unnecessary rerenders
- avoid shipping demo dependencies in production bundles

Target:

```text
core CSS gzip        < 25 KB
individual component JS should remain lightweight
```

Do not compromise maintainability solely to hit these targets, but monitor them.

---

# 46. Package Exports

Configure clean package exports.

Example:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

Ensure:
- ESM support
- TypeScript declarations
- source maps
- tree shaking

CJS support is optional unless required by the target project.

---

# 47. Documentation

The root README must include:

1. What Dossier UI is
2. Installation
3. Basic usage
4. Theme setup
5. CSS variables
6. Component examples
7. Accessibility statement
8. Browser support
9. Contributing instructions

Example usage:

```tsx
import {
  DocumentHeader,
  MetricRow,
  DataTable
} from "@dossier-ui/react";

import "@dossier-ui/react/styles.css";

export function App() {
  return (
    <>
      <DocumentHeader
        kicker="RELAY / EVENT INFRASTRUCTURE"
        title="EVENT DELIVERY CONTROL PLANE"
      />

      <MetricRow
        label="EVENTS PROCESSED"
        value="12,482"
        tone="green"
      />
    </>
  );
}
```

---

# 48. Design Tokens File

Create machine-readable token definitions.

Example:

```ts
export const colors = {
  paper: "#f2f0e9",
  paperMuted: "#e8e5dc",
  ink: "#242321",
  inkMuted: "#77736c",
  red: "#a9473f",
  blue: "#355d91",
  green: "#477b59",
  amber: "#94702d",
};
```

Also expose CSS variables generated from these tokens.

Do not maintain two manually divergent token sources.

---

# 49. Dark Theme

Create a dark variant that preserves the dossier character.

Suggested direction:

```css
--dossier-paper: #161614;
--dossier-paper-muted: #1f1f1b;

--dossier-ink: #e8e4d9;
--dossier-ink-soft: #c2beb3;
--dossier-ink-muted: #8f8b83;

--dossier-rule: #77736c;
--dossier-rule-light: #35342f;
```

Dark mode must not look like neon cyberpunk.

Keep colors muted.

---

# 50. Responsive Behavior

Desktop is the primary target, but mobile must remain usable.

On smaller screens:

- Header metadata may wrap
- Metrics may stack
- Tables scroll horizontally
- Sidebar becomes drawer
- Figures become full width
- Annotations may collapse below figure
- Dense labels remain readable
- Minimum touch target should still meet accessibility requirements

Do not simply shrink everything.

---

# 51. Component Build Order

Implement in this order.

## Phase 1 — Foundations

1. CSS reset
2. tokens
3. typography
4. spacing
5. themes
6. layout
7. Rule

## Phase 2 — Basic components

8. Button
9. Tag
10. Status
11. Metadata
12. Field
13. Input
14. Select
15. Checkbox
16. Radio

## Phase 3 — Signature components

17. DocumentHeader
18. Section
19. Metric
20. MetricRow
21. DataTable
22. Figure
23. Annotation
24. KeyValueList

## Phase 4 — Application components

25. Tabs
26. Sidebar
27. Breadcrumb
28. Dialog
29. Drawer
30. Toast
31. Tooltip
32. Pagination

## Phase 5 — Technical components

33. CodeBlock
34. LogViewer
35. JSONViewer
36. AuditTimeline
37. Progress
38. ChartFrame

## Phase 6 — Documentation

39. Storybook
40. Demo dashboard
41. test suite
42. README
43. package build
44. release preparation

---

# 52. First Milestone

The first milestone is complete when the following page can be built entirely using Dossier UI components:

```text
RELAY / COMMUNICATION INFRASTRUCTURE

EVENT DELIVERY CONTROL PLANE
──────────────────────────────────────────────────────────────────
ENV PROD   TENANT SMARTBUY   REGION AP-SOUTH-1   REV 17

EVENTS PROCESSED                                12,482
LAST 24 HOURS

DELIVERY RATE                                    98.7%

FAILED EVENTS                                      164

P95 LATENCY                                      420ms


FIGURE 01  PROVIDER ROUTING           4 PROVIDERS / 12,482 EVENTS
──────────────────────────────────────────────────────────────────

                        visualization

──────────────────────────────────────────────────────────────────


TABLE 01  RECENT EVENTS
──────────────────────────────────────────────────────────────────
ID        CHANNEL   PROVIDER   STATUS      LATENCY
01        SMS       SINCH      DELIVERED   314ms
02        EMAIL     SES        DELIVERED   521ms
03        WHATSAPP  META       FAILED      920ms
```

---

# 53. Things the Agent Must Avoid

Do not introduce the following visual patterns unless explicitly requested:

- Large border radii
- Pill buttons
- Glassmorphism
- Heavy drop shadows
- Neon colors
- Gradient backgrounds
- Giant dashboard cards
- Oversized whitespace
- Material Design styling
- Generic shadcn visual defaults
- Generic Tailwind dashboard styling
- Floating decorative blobs
- Excessive icons
- Illustration-heavy empty states

Using Radix primitives internally is acceptable if needed for accessibility, but their styling must be fully replaced.

---

# 54. Visual Quality Checklist

Before marking a component complete, verify:

- Does it look like part of a technical document?
- Does it work with dense information?
- Are lines and typography doing more work than decoration?
- Does it remain readable at compact density?
- Are numbers aligned correctly?
- Is metadata visually subordinate?
- Are accent colors used sparingly?
- Are states understandable without color alone?
- Does it work in paper and dark themes?
- Does it support keyboard navigation?
- Does it look consistent beside the DataTable?

If the component looks like a generic SaaS component, redesign it.

---

# 55. Code Quality Requirements

Use:
- strict TypeScript
- no `any` unless unavoidable and documented
- semantic component props
- forward refs where appropriate
- React `useId()` for generated IDs
- composition over duplication

Each component folder should follow:

```text
Button/
├── Button.tsx
├── Button.css
├── Button.types.ts
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

---

# 56. Accessibility Checklist

For every interactive component verify:

```text
[ ] keyboard accessible
[ ] focus visible
[ ] screen-reader name
[ ] semantic element used
[ ] disabled state exposed
[ ] contrast sufficient
[ ] error text associated
[ ] reduced motion respected
```

---

# 57. Suggested Development Commands

Provide commands similar to:

```bash
pnpm install

pnpm dev

pnpm storybook

pnpm test

pnpm test:e2e

pnpm build

pnpm lint

pnpm typecheck
```

Prefer `pnpm` workspaces.

---

# 58. Deliverables

The coding agent must produce:

```text
1. Complete monorepo
2. Design token package
3. Core CSS package
4. React component package
5. Storybook documentation
6. Playground/demo application
7. Paper theme
8. Dark theme
9. Unit tests
10. Accessibility tests
11. Visual regression tests
12. Build configuration
13. Package exports
14. README
15. Contribution guide
```

---

# 59. Definition of Done

The framework is considered ready for initial use when:

- Components compile without TypeScript errors
- `pnpm build` succeeds
- Storybook builds successfully
- Unit tests pass
- Core components are keyboard accessible
- Paper and dark themes work
- Demo dashboard is responsive
- DataTable handles at least 100 rows smoothly
- Package can be imported by a separate React app
- Global CSS does not unintentionally affect consumer applications
- Visual design remains consistent with the dossier aesthetic
- No component falls back to generic SaaS visual styling

---

# 60. Final Instruction to the Coding Agent

Do not treat this as a collection of styled React components.

Build it as a coherent **visual language for technical systems**.

The framework's identity must come primarily from:

```text
TYPOGRAPHY
+
RULES
+
DENSITY
+
TABLES
+
METADATA
+
NUMBERING
+
LIMITED COLOR
+
STRUCTURED INFORMATION
```

rather than:

```text
CARDS
+
SHADOWS
+
GRADIENTS
+
ROUNDED CONTAINERS
```

When uncertain about a design decision, choose the option that looks more like an engineering document, research paper, observability console, or intelligence dossier.

The strongest components in the first release should be:

1. DataTable
2. MetricRow
3. DocumentHeader
4. Figure
5. Section
6. Metadata
7. AuditTimeline
8. LogViewer

These components should establish the design language for the rest of the library.
