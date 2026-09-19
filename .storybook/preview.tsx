import React from 'react';
import type { Preview } from '@storybook/react-vite';
import '../packages/react/src/styles.css';
const preview: Preview = { globalTypes: { theme: { description: 'Theme', toolbar: { icon: 'circlehollow', items: ['paper', 'dark'] } }, density: { description: 'Density', toolbar: { items: ['compact', 'default', 'comfortable'] } } }, initialGlobals: { theme: 'paper', density: 'default' }, decorators: [(Story, context) => <div className="ds-root" data-dossier-theme={context.globals.theme} data-dossier-density={context.globals.density} style={{ background: 'var(--dossier-paper)', color: 'var(--dossier-ink)', padding: 24, minHeight: 200 }}><Story /></div>], parameters: { layout: 'padded', controls: { expanded: true } } };
export default preview;
