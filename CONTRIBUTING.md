# Contributing to Dossier UI

1. Install Node.js 22.18+ and pnpm 10+, then run `pnpm install`.
2. Run `pnpm dev` for documentation or `pnpm storybook` for isolated components.
3. Place changes in the relevant component family under `packages/react/src/`. Keep public props typed and re-export APIs from the package entry.
4. Use `ds-` class names and `--dossier-` tokens. Scope CSS so importing the framework does not reset unrelated applications.
5. Change tokens in `packages/tokens/src/tokens.ts`; regenerate CSS with `pnpm tokens:generate`.
6. Add stories and behavior tests for interactive changes. Prefer native semantics, accessible labels, controlled/uncontrolled state where useful, and forward refs for controls.
7. Verify `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm build:storybook`.
8. Run `pnpm test:e2e`. Review visual differences before accepting screenshot updates. Check both themes, all density modes, keyboard behavior, and small screens.

Avoid shadows, gradients, pill controls, and broad utility abstractions. Prefer thin rules, tabular numbers, metadata, and deliberate spacing. Runtime dependencies should stay small and consumer components must not import docs code.

The packages are configured for a local initial release. Before registry publication, choose ownership/licensing, confirm package availability, review exported APIs and accessibility, and run the complete release checks. Publication is not part of the local build.
