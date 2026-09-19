import {
  Children,
  cloneElement,
  createContext,
  createElement,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

export type Theme = 'paper' | 'dark';
export type Density = 'compact' | 'default' | 'comfortable';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'red' | 'blue' | 'green' | 'amber';
export const cx = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ');
export const normalizeTone = (tone: Tone = 'neutral') => ({ red: 'danger', blue: 'info', green: 'success', amber: 'warning' }[tone as 'red' | 'blue' | 'green' | 'amber'] || tone);
type CSSVars = CSSProperties & Record<`--dossier-${string}`, string | number | undefined>;
type BoxProps = HTMLAttributes<HTMLDivElement>;
type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
const space = (value: Space | string) => typeof value === 'number' ? `var(--dossier-space-${value})` : value;

export interface DossierProviderProps extends BoxProps { theme?: Theme; density?: Density; }
export const DossierProvider = forwardRef<HTMLDivElement, DossierProviderProps>(function DossierProvider({ theme = 'paper', density = 'default', className, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('ds-root', className)} data-dossier-theme={theme} data-dossier-density={density} />;
});

export interface TypographyProps extends HTMLAttributes<HTMLElement> { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'figcaption' | 'code'; uppercase?: boolean; }
function typography(name: string, tag: TypographyProps['as']) {
  return forwardRef<HTMLElement, TypographyProps>(function Typography({ as = tag, uppercase, className, ...props }, ref) {
    return createElement(as!, { ...props, ref, className: cx(`ds-${name}`, uppercase && 'ds-uppercase', className) });
  });
}
export const Display = typography('display', 'h1');
export const Heading = typography('heading', 'h2');
export const Subheading = typography('subheading', 'h3');
export const Body = typography('body', 'p');
export const Label = typography('label', 'span');
export const Meta = typography('meta', 'span');
export const Caption = typography('caption', 'p');
export const Code = typography('code', 'code');
export const NumberText = typography('number', 'span');
export { NumberText as Number };

export interface ContainerProps extends BoxProps { maxWidth?: CSSProperties['maxWidth']; }
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container({ maxWidth = '1200px', className, style, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('ds-container', className)} style={{ maxWidth, ...style }} />;
});
export interface LayoutProps extends BoxProps { gap?: Space | string; align?: CSSProperties['alignItems']; justify?: CSSProperties['justifyContent']; }
function layout(name: string) {
  return forwardRef<HTMLDivElement, LayoutProps>(function Layout({ gap = 3, align, justify, className, style, ...props }, ref) {
    return <div {...props} ref={ref} className={cx(`ds-${name}`, className)} style={{ gap: space(gap), alignItems: align, justifyContent: justify, ...style }} />;
  });
}
export const Stack = layout('stack');
export const Inline = layout('inline');
export const Cluster = layout('cluster');
export const Split = layout('split');
export interface GridProps extends LayoutProps { columns?: number; }
export interface GridItemProps extends BoxProps { span?: number; }
const GridRoot = forwardRef<HTMLDivElement, GridProps>(function Grid({ columns = 12, gap = 4, align, justify, className, style, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('ds-grid', className)} style={{ '--dossier-grid-columns': columns, gap: space(gap), alignItems: align, justifyContent: justify, ...style } as CSSVars} />;
});
const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem({ span = 1, className, style, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('ds-grid-item', className)} style={{ '--dossier-grid-span': span, ...style } as CSSVars} />;
});
export const Grid = Object.assign(GridRoot, { Item: GridItem });
export const Document = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Document({ className, ...props }, ref) {
  return <article {...props} ref={ref} className={cx('ds-document', className)} />;
});
export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> { index?: ReactNode; title?: ReactNode; description?: ReactNode; variant?: 'plain' | 'ruled' | 'numbered' | 'compact'; actions?: ReactNode; }
export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ index, title, description, variant = 'ruled', actions, children, className, ...props }, ref) {
  const headingId = useId();
  return <section aria-labelledby={title ? headingId : undefined} {...props} ref={ref} className={cx('ds-section', `ds-section-${variant}`, className)}>
    {(title || index || actions) && <div className="ds-section-header"><div className="ds-section-heading">{index && <span className="ds-section-index">{index}</span>}<div>{title && <h2 id={headingId} className="ds-subheading">{title}</h2>}{description && <p className="ds-section-description">{description}</p>}</div></div>{actions}</div>}
    {children}
  </section>;
});

export interface RuleProps extends HTMLAttributes<HTMLDivElement> { weight?: 'thin' | 'heavy'; variant?: 'thin' | 'heavy' | 'double' | 'dashed' | 'dotted'; label?: ReactNode; }
export const Rule = forwardRef<HTMLDivElement, RuleProps>(function Rule({ weight = 'thin', variant = weight, label, className, ...props }, ref) {
  return <div role="separator" {...props} ref={ref} className={cx('ds-rule', `ds-rule-${variant}`, !!label && 'ds-rule-labeled', className)}>{label && <span className="ds-rule-label">{label}</span>}</div>;
});
export interface MetadataItem { label: ReactNode; value: ReactNode; }
export interface MetadataProps extends HTMLAttributes<HTMLDListElement> { items: readonly MetadataItem[]; variant?: 'inline' | 'stacked' | 'distributed'; }
export function Metadata({ items, variant = 'inline', className, ...props }: MetadataProps) {
  return <dl {...props} className={cx('ds-metadata', `ds-metadata-${variant}`, className)}>{items.map((item, i) => <div className="ds-metadata-item" key={i}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
}
export interface DocumentHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> { kicker?: ReactNode; title: ReactNode; description?: ReactNode; metadata?: readonly (readonly [ReactNode, ReactNode])[]; actions?: ReactNode; }
export function DocumentHeader({ kicker, title, description, metadata, actions, className, ...props }: DocumentHeaderProps) {
  return <header {...props} className={cx('ds-document-header', className)}>{kicker && <p className="ds-document-kicker">{kicker}</p>}<div className="ds-document-title-row"><h1 className="ds-display">{title}</h1>{actions}</div>{description && <p className="ds-document-description">{description}</p>}<Rule weight="heavy" />{metadata && <Metadata items={metadata.map(([label, value]) => ({ label, value }))} />}</header>;
}

export interface MetricProps extends Omit<BoxProps, 'title'> { label: ReactNode; value: ReactNode; description?: ReactNode; trend?: ReactNode; tone?: Tone; }
export function Metric({ label, value, description, trend, tone = 'neutral', className, ...props }: MetricProps) {
  return <div {...props} className={cx('ds-metric', `ds-tone-${normalizeTone(tone)}`, className)}><div className="ds-metric-label">{label}</div><div className="ds-metric-value">{value}{trend && <span className="ds-metric-trend">{trend}</span>}</div>{description && <div className="ds-metric-description">{description}</div>}</div>;
}
export function MetricRow({ label, value, description, trend, tone = 'neutral', className, ...props }: MetricProps) {
  return <div {...props} className={cx('ds-metric-row', `ds-tone-${normalizeTone(tone)}`, className)}><div><div className="ds-metric-label">{label}</div>{description && <div className="ds-metric-description">{description}</div>}</div><div className="ds-metric-value">{value}{trend && <span className="ds-metric-trend">{trend}</span>}</div></div>;
}
export interface MetricGroupProps extends BoxProps { columns?: 1 | 2 | 3 | 4; }
export function MetricGroup({ columns = 4, className, style, ...props }: MetricGroupProps) {
  return <div {...props} className={cx('ds-metric-group', className)} style={{ '--dossier-metric-columns': columns, ...style } as CSSVars} />;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'outline' | 'solid' | 'danger' | 'ghost' | 'plain' | 'muted'; size?: Size; loading?: boolean; leadingIcon?: ReactNode; trailingIcon?: ReactNode; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'outline', size = 'md', loading = false, disabled, leadingIcon, trailingIcon, children, className, type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} className={cx('ds-button', `ds-button-${variant}`, `ds-size-${size}`, className)} disabled={disabled || loading} aria-busy={loading || undefined}>{loading ? <span className="ds-button-loader" aria-hidden="true" /> : leadingIcon}{children}{trailingIcon}</button>;
});
export interface IconButtonProps extends Omit<ButtonProps, 'leadingIcon' | 'trailingIcon'> { label: string; }
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, className, ...props }, ref) {
  return <Button aria-label={label} title={label} {...props} ref={ref} className={cx('ds-icon-button', className)} />;
});
export function ButtonGroup({ className, ...props }: BoxProps) { return <div role="group" {...props} className={cx('ds-button-group', className)} />; }

export interface StatusProps extends HTMLAttributes<HTMLSpanElement> { tone?: Tone; dot?: boolean; }
export function Status({ tone = 'neutral', dot = true, children, className, ...props }: StatusProps) {
  return <span {...props} className={cx('ds-status', `ds-tone-${normalizeTone(tone)}`, className)}>{dot && <span aria-hidden="true" className="ds-status-dot" />}{children}</span>;
}
export interface TagProps extends StatusProps { variant?: 'outline' | 'filled' | 'muted' | 'technical'; index?: ReactNode; }
export function Tag({ tone = 'neutral', variant = 'outline', index, children, className, dot: _dot, ...props }: TagProps) {
  return <span {...props} className={cx('ds-tag', `ds-tag-${variant}`, `ds-tone-${normalizeTone(tone)}`, className)}>{index && <span className="ds-tag-index">{index}</span>}{children}</span>;
}

type ValidationState = 'default' | 'success' | 'warning' | 'error';
interface FieldContextValue { id: string; describedBy?: string; invalid?: boolean; disabled?: boolean; required?: boolean; state?: ValidationState; }
const FieldContext = createContext<FieldContextValue | undefined>(undefined);
export interface FieldProps extends BoxProps { label: ReactNode; help?: ReactNode; error?: ReactNode; required?: boolean; disabled?: boolean; state?: ValidationState; htmlFor?: string; }
export function Field({ label, help, error, required, disabled, state = error ? 'error' : 'default', htmlFor, children, className, ...props }: FieldProps) {
  const generatedId = useId();
  const child = Children.count(children) === 1 && isValidElement(children) ? children as ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean; required?: boolean; disabled?: boolean }> : undefined;
  const id = htmlFor || child?.props.id || generatedId;
  const describedBy = [help ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const invalid = state === 'error';
  // Context supports wrapped Dossier controls; cloning covers a direct native control.
  const content = child && typeof child.type === 'string' ? cloneElement(child, { id, 'aria-describedby': [child.props['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined, 'aria-invalid': invalid || undefined, required, disabled }) : children;
  return <FieldContext.Provider value={{ id, describedBy, invalid, disabled, required, state }}><div {...props} className={cx('ds-field', `ds-field-${state}`, disabled && 'ds-field-disabled', className)}><label className="ds-field-label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>{content}{help && <p id={`${id}-help`} className="ds-field-help">{help}</p>}{error && <p id={`${id}-error`} className="ds-field-error">{error}</p>}</div></FieldContext.Provider>;
}
function useFieldControl(props: { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: InputHTMLAttributes<HTMLInputElement>['aria-invalid']; disabled?: boolean; required?: boolean }) {
  const field = useContext(FieldContext);
  return { id: props.id || field?.id, 'aria-describedby': [props['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined, 'aria-invalid': props['aria-invalid'] ?? (field?.invalid || undefined), disabled: props.disabled ?? field?.disabled, required: props.required ?? field?.required, 'data-state': field?.state };
}
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { invalid?: boolean; }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, ...props }, ref) {
  const field = useFieldControl(props);
  return <input {...props} {...field} aria-invalid={invalid || field['aria-invalid']} ref={ref} className={cx('ds-input', className)} />;
});
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { invalid?: boolean; }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, rows = 4, ...props }, ref) {
  const field = useFieldControl(props);
  return <textarea {...props} {...field} rows={rows} aria-invalid={invalid || field['aria-invalid']} ref={ref} className={cx('ds-input', 'ds-textarea', className)} />;
});
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { invalid?: boolean; options?: readonly { label: string; value: string; disabled?: boolean }[]; }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, invalid, options, children, ...props }, ref) {
  const field = useFieldControl(props);
  return <select {...props} {...field} aria-invalid={invalid || field['aria-invalid']} ref={ref} className={cx('ds-input', 'ds-select', className)}>{options ? options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>) : children}</select>;
});
export interface CheckControlProps extends Omit<InputProps, 'size' | 'children'> { label?: ReactNode; description?: ReactNode; }
function checkControl(type: 'checkbox' | 'radio', switchRole = false) {
  return forwardRef<HTMLInputElement, CheckControlProps>(function CheckControl({ label, description, className, invalid, id: providedId, ...props }, ref) {
    const fallbackId = useId();
    const field = useFieldControl({ id: providedId, ...props });
    const id = field.id || fallbackId;
    const descriptionId = description ? `${id}-description` : undefined;
    const input = <input {...props} {...field} id={id} aria-describedby={[field['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined} aria-invalid={invalid || field['aria-invalid']} ref={ref} type={type} role={switchRole ? 'switch' : undefined} className={cx(switchRole ? 'ds-switch-input' : `ds-${type}`, className)} />;
    return <span className={cx('ds-check-control', field.disabled && 'ds-check-disabled')}>{input}{switchRole && <span className="ds-switch-track" aria-hidden="true" />}{label && <label className="ds-check-label" htmlFor={id}>{label}{description && <span className="ds-check-description" id={descriptionId}>{description}</span>}</label>}{!label && description && <span className="ds-check-description" id={descriptionId}>{description}</span>}</span>;
  });
}
export const Checkbox = checkControl('checkbox');
export const Radio = checkControl('radio');
export const Switch = checkControl('checkbox', true);
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(function SearchInput({ className, ...props }, ref) {
  return <span className="ds-search-input"><svg className="ds-search-icon" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.5" /></svg><Input {...props} ref={ref} type="search" className={className} /></span>;
});
export const NumberInput = forwardRef<HTMLInputElement, InputProps>(function NumberInput(props, ref) { return <Input {...props} ref={ref} type="number" />; });
