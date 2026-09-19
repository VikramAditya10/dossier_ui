import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Icon, iconNames } from './index';

describe('@dossier-ui/icons', () => {
  it('exports valid icon names list', () => {
    expect(iconNames).toContain('terminal');
    expect(iconNames).toContain('check');
    expect(iconNames.length).toBeGreaterThan(10);
  });

  it('renders decorative icon with aria-hidden', () => {
    const { container } = render(<Icon name="terminal" size={20} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveClass('ds-icon');
  });

  it('renders accessible icon with label and title', () => {
    const { getByRole } = render(<Icon name="check" label="Success indicator" />);
    const svg = getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveTextContent('Success indicator');
  });
});
