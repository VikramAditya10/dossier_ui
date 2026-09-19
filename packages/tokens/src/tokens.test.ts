import { describe, it, expect } from 'vitest';
import { colors, darkColors, spacing, typography, density, zIndex } from './tokens';

describe('@dossier-ui/tokens', () => {
  it('exports paper and dark color palettes', () => {
    expect(colors.paper).toBeDefined();
    expect(darkColors.paper).toBeDefined();
    expect(colors.paper).toMatch(/^#/);
    expect(darkColors.paper).toMatch(/^#/);
    expect(colors.accentBlue).toBeDefined();
    expect(darkColors.accentBlue).toBeDefined();
  });

  it('exports spacing scale', () => {
    expect(spacing[0]).toBe('0');
    expect(spacing[1]).toBe('4px');
    expect(spacing[4]).toBe('16px');
    expect(spacing[8]).toBe('32px');
  });

  it('exports monospace typography stack and scale', () => {
    expect(typography.fontMono).toContain('monospace');
    expect(typography.textXs).toBeDefined();
    expect(typography.textMd).toBeDefined();
    expect(typography.text2xl).toBeDefined();
  });

  it('exports density definitions', () => {
    expect(density.compact.controlHeight).toBeDefined();
    expect(density.default.controlHeight).toBeDefined();
    expect(density.comfortable.controlHeight).toBeDefined();
  });

  it('exports z-index layers', () => {
    expect(Number(zIndex.dropdown)).toBeGreaterThan(Number(zIndex.sticky));
    expect(Number(zIndex.tooltip)).toBeGreaterThan(Number(zIndex.overlay));
  });
});
