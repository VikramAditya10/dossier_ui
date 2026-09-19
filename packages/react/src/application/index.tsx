import {
  Children, createContext, forwardRef, isValidElement, useCallback, useContext,
  useEffect, useId, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type DialogHTMLAttributes, type HTMLAttributes,
  type KeyboardEvent, type MouseEventHandler, type ReactElement, type ReactNode,
} from 'react';

const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

type Orientation = 'horizontal' | 'vertical';
interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  id: string;
  orientation: Orientation;
  activationMode: 'automatic' | 'manual';
}
const TabsContext = createContext<TabsContextValue | null>(null);
function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs subcomponents must be rendered inside Tabs.');
  return context;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  activationMode?: 'automatic' | 'manual';
}
function firstTab(children: ReactNode): string | undefined {
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ value?: string; disabled?: boolean; children?: ReactNode }>(child)) continue;
    if (child.type === TabsTrigger && !child.props.disabled) return child.props.value;
    const nested = firstTab(child.props.children);
    if (nested) return nested;
  }
  return undefined;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value: controlled, defaultValue, onValueChange, orientation = 'horizontal', activationMode = 'automatic', children, className, ...props }, ref,
) {
  const id = useId();
  const [internal, setInternal] = useState(() => defaultValue ?? firstTab(children) ?? '');
  const value = controlled ?? internal;
  const setValue = useCallback((next: string) => {
    if (next === value) return;
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  }, [controlled, value, onValueChange]);
  const context = useMemo(() => ({ value, setValue, id, orientation, activationMode }), [value, setValue, id, orientation, activationMode]);
  return <TabsContext.Provider value={context}><div ref={ref} className={cx('ds-tabs', className)} data-orientation={orientation} {...props}>{children}</div></TabsContext.Provider>;
});

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TabsList(
  { className, onKeyDown, ...props }, ref,
) {
  const { orientation, activationMode } = useTabs();
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !(event.target instanceof HTMLElement) || event.target.getAttribute('role') !== 'tab') return;
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const current = tabs.indexOf(event.target as HTMLButtonElement);
    const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    let index: number;
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else if (event.key === previous) index = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === next) index = (current + 1) % tabs.length;
    else return;
    event.preventDefault();
    tabs[index]?.focus();
    if (activationMode === 'automatic') tabs[index]?.click();
  };
  return <div ref={ref} className={cx('ds-tabs-list', className)} role="tablist" aria-orientation={orientation} onKeyDown={handleKeyDown} {...props} />;
});

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { value: string }
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, onClick, children, ...props }, ref,
) {
  const tabs = useTabs();
  const key = encodeURIComponent(value);
  return <button {...props} ref={ref} type="button" role="tab" id={`${tabs.id}-tab-${key}`}
    aria-selected={tabs.value === value} aria-controls={`${tabs.id}-panel-${key}`}
    tabIndex={tabs.value === value ? 0 : -1} className={cx('ds-tabs-trigger', className)}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented) tabs.setValue(value); }}>{children}</button>;
});

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> { value: string; forceMount?: boolean }
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, forceMount = false, className, children, ...props }, ref,
) {
  const tabs = useTabs();
  const key = encodeURIComponent(value);
  const active = tabs.value === value;
  // Keep panel landmarks mounted so aria-controls always references a real node.
  return <div {...props} ref={ref} role="tabpanel" id={`${tabs.id}-panel-${key}`}
    aria-labelledby={`${tabs.id}-tab-${key}`} hidden={!active} tabIndex={0}
    className={cx('ds-tabs-content', className)}>{active || forceMount ? children : null}</div>;
});
export const Tabs = Object.assign(TabsRoot, { List: TabsList, Trigger: TabsTrigger, Content: TabsContent });

export interface SidebarProps extends HTMLAttributes<HTMLElement> { header?: ReactNode; footer?: ReactNode }
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ header, footer, children, className, ...props }, ref) {
  return <aside ref={ref} className={cx('ds-sidebar', className)} {...props}>
    {header && <div className="ds-sidebar-header">{header}</div>}
    <div className="ds-sidebar-body">{children}</div>
    {footer && <div className="ds-sidebar-footer">{footer}</div>}
  </aside>;
});

export interface NavGroupProps extends HTMLAttributes<HTMLElement> { title: string; index?: string }
export function NavGroup({ title, index, className, children, ...props }: NavGroupProps) {
  const id = useId();
  return <nav className={cx('ds-nav-group', className)} aria-labelledby={id} {...props}>
    <div id={id} className="ds-nav-group-title">{index && <span>{index}</span>}{title}</div>
    <div className="ds-nav-group-items">{children}</div>
  </nav>;
}

export interface NavItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  index?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}
export function NavItem({ href, active, disabled, index, icon, badge, children, className, onClick, target, rel, ...props }: NavItemProps) {
  const shared = {
    ...props,
    className: cx('ds-nav-item', active && 'ds-nav-item-active', className),
    'aria-current': active ? 'page' as const : undefined,
    'aria-disabled': disabled || undefined,
    onClick: ((event) => { if (disabled) event.preventDefault(); else onClick?.(event); }) as MouseEventHandler<HTMLElement>,
  };
  const content = <>{index && <span className="ds-nav-index" aria-hidden="true">{index}</span>}{icon}<span className="ds-nav-label">{children}</span>{badge && <span className="ds-nav-badge">{badge}</span>}</>;
  return href ? <a {...shared} href={disabled ? undefined : href} tabIndex={disabled ? -1 : props.tabIndex} target={target} rel={target === '_blank' ? rel ?? 'noopener noreferrer' : rel}>{content}</a>
    : <button {...shared} type="button" disabled={disabled}>{content}</button>;
}

export interface BreadcrumbItem { label: ReactNode; href?: string }
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> { items: BreadcrumbItem[] }
export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return <nav aria-label="Breadcrumb" className={cx('ds-breadcrumb', className)} {...props}><ol>
    {items.map((item, index) => <li key={index}>{index > 0 && <span className="ds-breadcrumb-separator" aria-hidden="true">/</span>}
      {item.href && index !== items.length - 1 ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
    </li>)}
  </ol></nav>;
}

export interface TopBarProps extends HTMLAttributes<HTMLElement> { brand?: ReactNode; actions?: ReactNode }
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar({ brand, actions, children, className, ...props }, ref) {
  return <header ref={ref} className={cx('ds-top-bar', className)} {...props}>{brand && <div className="ds-top-bar-brand">{brand}</div>}<div className="ds-top-bar-content">{children}</div>{actions && <div className="ds-top-bar-actions">{actions}</div>}</header>;
});

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open' | 'onClose'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  closeOnOutsideClick?: boolean;
  closeLabel?: string;
}
const focusableSelector = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open, onOpenChange, title, description, footer, children, className, closeOnOutsideClick = true, closeLabel = 'Close dialog', onCancel, onClick, onKeyDown, ...props }, forwardedRef,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const changeRef = useRef(onOpenChange);
  changeRef.current = onOpenChange;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      }
      const target = dialog.querySelector<HTMLElement>('[autofocus]') ?? dialog.querySelector<HTMLElement>(focusableSelector) ?? dialog;
      target.focus();
    } else if (dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      restoreFocusRef.current?.focus();
    }
    return () => { if (open) restoreFocusRef.current?.focus(); };
  }, [open]);
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') { event.preventDefault(); changeRef.current(false); return; }
    if (event.key !== 'Tab') return;
    const focusables = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector)).filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first) { event.preventDefault(); event.currentTarget.focus(); }
    else if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <dialog {...props} ref={node => { dialogRef.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
    className={cx('ds-dialog', className)} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}
    aria-modal="true" tabIndex={-1} onKeyDown={trapFocus}
    onCancel={event => { onCancel?.(event); if (!event.defaultPrevented) { event.preventDefault(); onOpenChange(false); } }}
    onClose={() => { if (open) onOpenChange(false); }}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented && closeOnOutsideClick && event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onOpenChange(false); } }}>
    <div className="ds-dialog-heading"><h2 id={titleId}>{title}</h2><button type="button" className="ds-dialog-close" onClick={() => onOpenChange(false)} aria-label={closeLabel}><span aria-hidden="true">×</span></button></div>
    <div className="ds-dialog-body">{description && <p id={descriptionId} className="ds-dialog-description">{description}</p>}{children}</div>
    {footer && <div className="ds-dialog-footer">{footer}</div>}
  </dialog>;
});

export interface ConfirmDialogProps extends Omit<DialogProps, 'footer'> {
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  tone?: 'danger' | 'neutral';
  disabled?: boolean;
  onError?: (error: unknown) => void;
}
export function ConfirmDialog({ onConfirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel', pendingLabel = 'Working…', tone = 'danger', disabled, onError, ...props }: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (props.open) setError(null); }, [props.open]);
  const confirm = async () => {
    setPending(true); setError(null);
    try { await onConfirm(); props.onOpenChange(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'The action could not be completed. Try again.'); onError?.(reason); }
    finally { setPending(false); }
  };
  return <Dialog {...props} onOpenChange={next => { if (!pending) props.onOpenChange(next); }} footer={<>
    {error && <p role="alert" className="ds-confirm-error">{error}</p>}
    <button type="button" className="ds-dialog-action" autoFocus disabled={pending} onClick={() => props.onOpenChange(false)}>{cancelLabel}</button>
    <button type="button" className="ds-dialog-action" data-tone={tone} disabled={disabled || pending} aria-busy={pending} onClick={() => { void confirm(); }}>{pending ? pendingLabel : confirmLabel}</button>
  </>} />;
}

export interface DrawerProps extends DialogProps { side?: 'left' | 'right' }
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer({ side = 'right', className, ...props }, ref) {
  return <Dialog {...props} ref={ref} className={cx('ds-drawer', className)} data-side={side} />;
});

export type NotificationTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  tone?: NotificationTone;
  onDismiss?: () => void;
  dismissLabel?: string;
}
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast({ title, description, tone = 'info', onDismiss, dismissLabel = 'Dismiss notification', className, ...props }, ref) {
  return <div ref={ref} role={tone === 'danger' ? 'alert' : 'status'} className={cx('ds-toast', className)} data-tone={tone} {...props}>
    <span className="ds-toast-tone">{tone}</span><div className="ds-toast-content"><strong>{title}</strong>{description && <p>{description}</p>}</div>
    {onDismiss && <button type="button" aria-label={dismissLabel} onClick={onDismiss} className="ds-toast-dismiss"><span aria-hidden="true">×</span></button>}
  </div>;
});

export interface ToastOptions { title: ReactNode; description?: ReactNode; tone?: NotificationTone; duration?: number }
interface ToastRecord extends ToastOptions { id: string }
interface ToastContextValue { toast: (options: ToastOptions) => string; dismiss: (id: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null);
function ManagedToast({ record, dismiss }: { record: ToastRecord; dismiss: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (record.duration === 0 || paused) return;
    const timer = window.setTimeout(() => dismiss(record.id), record.duration ?? 6000);
    return () => window.clearTimeout(timer);
  }, [record, paused, dismiss]);
  return <Toast {...record} onDismiss={() => dismiss(record.id)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} />;
}
export function ToastProvider({ children, maxVisible = 5 }: { children: ReactNode; maxVisible?: number }) {
  const [records, setRecords] = useState<ToastRecord[]>([]);
  const prefix = useId();
  const counter = useRef(0);
  const dismiss = useCallback((id: string) => setRecords(previous => previous.filter(record => record.id !== id)), []);
  const toast = useCallback((options: ToastOptions) => {
    const id = `${prefix}-toast-${counter.current++}`;
    setRecords(previous => [...previous, { ...options, id }].slice(-Math.max(1, maxVisible)));
    return id;
  }, [prefix, maxVisible]);
  const context = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return <ToastContext.Provider value={context}>{children}<section className="ds-toast-region" aria-label="Notifications">{records.map(record => <ManagedToast key={record.id} record={record} dismiss={dismiss} />)}</section></ToastContext.Provider>;
}
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider.');
  return context;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content' | 'children'> {
  content: ReactNode;
  children: ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
}
export function Tooltip({ content, children, side = 'top', disabled, className, onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, ...props }: TooltipProps) {
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = !disabled && !dismissed && (hovered || focused);
  // The wrapper associates a description with its interactive child through the
  // inherited aria-describedby only when rendered; cloning preserves child handlers.
  const child = children as ReactElement<{ 'aria-describedby'?: string }>;
  return <span {...props} className={cx('ds-tooltip-anchor', className)}
    onMouseEnter={event => { onMouseEnter?.(event); setHovered(true); setDismissed(false); }}
    onMouseLeave={event => { onMouseLeave?.(event); setHovered(false); }}
    onFocus={event => { onFocus?.(event); setFocused(true); setDismissed(false); }}
    onBlur={event => { onBlur?.(event); if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => { onKeyDown?.(event); if (event.key === 'Escape') { setDismissed(true); event.stopPropagation(); } }}>
    <TooltipChild child={child} description={disabled ? undefined : [child.props['aria-describedby'], id].filter(Boolean).join(' ')} />
    {!disabled && <span className="ds-tooltip" id={id} role="tooltip" data-side={side} hidden={!visible}>{content}</span>}
  </span>;
}

// Kept separate to make the small child-prop modification explicit.
import { cloneElement } from 'react';
function TooltipChild({ child, description }: { child: ReactElement<{ 'aria-describedby'?: string }>; description?: string }) {
  return cloneElement(child, { 'aria-describedby': description });
}

export interface CalloutProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  tone?: NotificationTone;
}
export function Callout({ title, tone = 'info', children, className, ...props }: CalloutProps) {
  return <aside {...props} className={cx('ds-callout', className)} data-tone={tone}>
    {title && <strong className="ds-callout-title">{title}</strong>}
    <div>{children}</div>
  </aside>;
}
