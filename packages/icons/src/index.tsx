import { forwardRef, useId, type ReactNode, type SVGProps } from 'react';

const paths = {
  'arrow-right': <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  'arrow-up-right': <><path d="M6 18 18 6M6 6h12v12" /></>,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20.5 13.1A8.7 8.7 0 0 1 10.9 3.5 8.8 8.8 0 1 0 20.5 13.1Z" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="1" /><path d="M16 8V3H3v13h5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />,
  external: <><path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" /></>,
  plus: <path d="M12 4v16M4 12h16" />,
  settings: <><path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 2 3h3l1-3 3-1 2-3-2-2 1-3-2-3-3 1-2-3Z" /><circle cx="11.5" cy="11.5" r="3" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  file: <><path d="M14 2H4v20h16V8l-6-6Zm0 0v6h6M8 13h8M8 17h6" /></>,
  terminal: <><rect x="2" y="4" width="20" height="16" rx="1" /><path d="m6 8 4 4-4 4m7 0h5" /></>,
  github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.2-1.8-1-2 3-.3 6-1.5 6-6 0-1.3-.5-2.5-1.5-3.5.2-1 .1-2.2-.5-3.5-1.7 0-3 1-4 1.5a12 12 0 0 0-6 0C7 4 5.7 3 4 3c-.6 1.3-.7 2.5-.5 3.5A5 5 0 0 0 2 10c0 4.5 3 5.7 6 6-.8.4-1 1.3-1 2v4" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;
export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  /** Omit for decorative icons. Labelled icons are exposed as images. */
  label?: string;
}

/** Small, dependency-free technical icons for Dossier UI. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 16, label, className, ...props }, ref,
) {
  const titleId = useId();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"
      className={['ds-icon', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined} aria-hidden={label ? undefined : true}
      aria-labelledby={label ? titleId : undefined} focusable="false" {...props}>
      {label && <title id={titleId}>{label}</title>}
      {paths[name]}
    </svg>
  );
});

export const iconNames = Object.keys(paths) as IconName[];
