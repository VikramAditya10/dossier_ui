import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  DossierProvider,
  Button,
  Status,
  Tag,
  Callout,
  MetricRow,
  Input,
  Section,
  Rule,
} from './index';

describe('@dossier-ui/react', () => {
  it('renders DossierProvider with theme and density attributes', () => {
    const { container } = render(
      <DossierProvider theme="dark" density="compact">
        <span>Child content</span>
      </DossierProvider>,
    );

    const root = container.firstElementChild;
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('data-dossier-theme', 'dark');
    expect(root).toHaveAttribute('data-dossier-density', 'compact');
    expect(root).toHaveClass('ds-root');
  });

  it('renders Button with variants and handles click', () => {
    render(<Button variant="solid">Deploy Node</Button>);
    const btn = screen.getByRole('button', { name: /deploy node/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('ds-button');
    expect(btn).toHaveClass('ds-button-solid');
  });

  it('renders Status indicator with dot', () => {
    render(<Status tone="success">ONLINE</Status>);
    const status = screen.getByText('ONLINE');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('ds-status');
    expect(status).toHaveClass('ds-tone-success');
  });

  it('renders Tag with variant and index', () => {
    render(<Tag variant="technical" index="01" tone="info">TAG_CONTENT</Tag>);
    expect(screen.getByText('TAG_CONTENT')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('renders Callout message', () => {
    render(<Callout title="NOTICE">System maintenance active</Callout>);
    expect(screen.getByText('NOTICE')).toBeInTheDocument();
    expect(screen.getByText('System maintenance active')).toBeInTheDocument();
  });

  it('renders MetricRow with label and value', () => {
    render(<MetricRow label="CPU USAGE" value="48.2%" tone="info" />);
    expect(screen.getByText('CPU USAGE')).toBeInTheDocument();
    expect(screen.getByText('48.2%')).toBeInTheDocument();
  });

  it('renders Input element with placeholder', () => {
    render(<Input placeholder="Enter hostname..." />);
    const input = screen.getByPlaceholderText('Enter hostname...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('ds-input');
  });

  it('renders Section and Rule separators', () => {
    render(
      <Section title="STORAGE" index="[02]">
        <Rule weight="heavy" />
        <p>Section Content</p>
      </Section>,
    );
    expect(screen.getByText('STORAGE')).toBeInTheDocument();
    expect(screen.getByText('[02]')).toBeInTheDocument();
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });
});
