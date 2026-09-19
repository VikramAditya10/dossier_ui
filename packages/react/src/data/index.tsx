import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

type DataTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
const classes = (...values: (string | false | undefined)[]) => values.filter(Boolean).join(' ');

export interface DataColumn<T extends object> {
  key: keyof T | (string & {});
  header: ReactNode;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  sortable?: boolean;
  compare?: (a: T, b: T) => number;
  numeric?: boolean;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  width?: CSSProperties['width'];
  tone?: DataTone | ((row: T) => DataTone);
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T extends object> {
  columns: readonly DataColumn<T>[];
  rows: readonly T[];
  getRowId?: (row: T, index: number) => Key;
  density?: 'compact' | 'default' | 'comfortable';
  numbered?: boolean;
  striped?: boolean;
  grid?: boolean;
  selectable?: boolean;
  selectedKeys?: readonly Key[];
  defaultSelectedKeys?: readonly Key[];
  onSelectionChange?: (keys: Key[]) => void;
  sort?: TableSort | null;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  disabled?: boolean;
  emptyState?: ReactNode;
  caption?: ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  onRowClick?: (row: T) => void;
  isRowDisabled?: (row: T) => boolean;
}

function readValue<T extends object>(row: T, key: DataColumn<T>['key']): unknown {
  return row[key as keyof T];
}

function compareValues(a: unknown, b: unknown) {
  if (a === b) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function CellText({ children, truncate }: { children: ReactNode; truncate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;
  useEffect(() => {
    const element = ref.current;
    if (!element || !truncate) return;
    const measure = () => setOverflow(element.scrollWidth > element.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, truncate]);
  return (
    <span ref={ref} className={truncate ? 'ds-data-truncate' : undefined} title={overflow ? text : undefined}>
      {children}
    </span>
  );
}

/** A semantic table with local sorting, pagination and optional row selection. */
export function DataTable<T extends object>({
  columns,
  rows,
  getRowId,
  density = 'default',
  numbered = false,
  striped = false,
  grid = false,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  sort: controlledSort,
  defaultSort,
  onSortChange,
  pagination = false,
  pageSize = 10,
  loading = false,
  disabled = false,
  emptyState,
  caption,
  'aria-label': label = 'Data table',
  className,
  style,
  onRowClick,
  isRowDisabled,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<TableSort | null>(defaultSort ?? null);
  const [internalSelection, setInternalSelection] = useState<readonly Key[]>(defaultSelectedKeys);
  const [page, setPage] = useState(1);
  const [focusedRow, setFocusedRow] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const sort = controlledSort === undefined ? internalSort : controlledSort;
  const selected = selectedKeys ?? internalSelection;
  const selection = useMemo(() => new Set(selected), [selected]);
  const size = Math.max(1, Math.floor(pageSize) || 10);
  const rowEntries = useMemo(() => rows.map((row, index) => {
    const id = 'id' in row && (typeof row.id === 'string' || typeof row.id === 'number') ? row.id : index;
    return { row, originalIndex: index, key: getRowId?.(row, index) ?? id };
  }), [rows, getRowId]);
  const sorted = useMemo(() => {
    if (!sort) return rowEntries;
    const column = columns.find((item) => item.key === sort.key);
    if (!column) return rowEntries;
    return [...rowEntries].sort((a, b) => {
      const comparison = column.compare?.(a.row, b.row) ?? compareValues(readValue(a.row, column.key), readValue(b.row, column.key));
      return (sort.direction === 'asc' ? comparison : -comparison) || a.originalIndex - b.originalIndex;
    });
  }, [rowEntries, sort, columns]);
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const currentPage = Math.min(page, pageCount);
  const offset = pagination ? (currentPage - 1) * size : 0;
  const visible = pagination ? sorted.slice(offset, offset + size) : sorted;
  const enabledKeys = visible.filter(({ row }) => !isRowDisabled?.(row)).map(({ key }) => key);
  const allSelected = enabledKeys.length > 0 && enabledKeys.every((key) => selection.has(key));
  const partlySelected = !allSelected && enabledKeys.some((key) => selection.has(key));
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = partlySelected;
  }, [partlySelected]);
  const setSelection = (next: Key[]) => {
    if (selectedKeys === undefined) setInternalSelection(next);
    onSelectionChange?.(next);
  };
  const toggleRow = (key: Key) => setSelection(selection.has(key) ? selected.filter((value) => value !== key) : [...selected, key]);
  const changeSort = (column: DataColumn<T>) => {
    const next: TableSort = { key: String(column.key), direction: sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc' };
    if (controlledSort === undefined) setInternalSort(next);
    onSortChange?.(next);
    setPage(1);
  };
  const navigateRow = (event: KeyboardEvent<HTMLTableRowElement>, index: number, key: Key, row: T) => {
    if (event.target !== event.currentTarget) return;
    let next = index;
    if (event.key === 'ArrowDown') next = Math.min(visible.length - 1, index + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visible.length - 1;
    else if (event.key === ' ' && selectable && !disabled && !isRowDisabled?.(row)) {
      event.preventDefault();
      toggleRow(key);
      return;
    } else if (event.key === 'Enter' && onRowClick && !disabled && !isRowDisabled?.(row)) {
      event.preventDefault();
      onRowClick(row);
      return;
    } else return;
    event.preventDefault();
    setFocusedRow(next);
    tableRef.current?.querySelectorAll<HTMLTableRowElement>('tbody tr[data-row]')[next]?.focus();
  };
  const columnCount = columns.length + Number(numbered) + Number(selectable);
  return (
    <div className={classes('ds-data-table', className)} style={style} data-density={density} aria-busy={loading || undefined}>
      <div className="ds-table-scroll" role="region" aria-label={`${label}, scrollable`} tabIndex={0}>
        <table ref={tableRef} className={classes('ds-table', striped && 'ds-table-striped', grid && 'ds-table-grid')} aria-label={label}>
          {caption && <caption>{caption}</caption>}
          <thead><tr>
            {selectable && <th className="ds-table-check" scope="col"><input ref={selectAllRef} type="checkbox" aria-label="Select all rows on this page" checked={allSelected} disabled={disabled || loading || enabledKeys.length === 0} onChange={() => {
              const next = new Set(selected);
              enabledKeys.forEach((key) => allSelected ? next.delete(key) : next.add(key));
              setSelection([...next]);
            }} /></th>}
            {numbered && <th scope="col" className="ds-table-index"><span aria-label="Row number">#</span></th>}
            {columns.map((column) => <th key={String(column.key)} scope="col" style={{ textAlign: column.align ?? (column.numeric ? 'right' : 'left'), width: column.width }} aria-sort={column.sortable ? sort?.key === column.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined}>
              {column.sortable ? <button type="button" className="ds-table-sort" disabled={disabled || loading} onClick={() => changeSort(column)}>{column.header}<span aria-hidden="true">{sort?.key === column.key ? sort.direction === 'asc' ? '↑' : '↓' : '↕'}</span></button> : column.header}
            </th>)}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={columnCount}><div className="ds-table-loading"><InlineLoader label="Loading records" /><SkeletonRow columns={Math.max(1, columns.length)} /></div></td></tr> : visible.length === 0 ? <tr><td colSpan={columnCount}>{emptyState ?? <EmptyState title="No records found" description="No records match the current query." />}</td></tr> : visible.map(({ row, originalIndex, key }, index) => {
              const rowDisabled = disabled || isRowDisabled?.(row);
              return <tr key={key} data-row="" data-selected={selection.has(key) || undefined} aria-selected={selectable ? selection.has(key) : undefined} aria-disabled={rowDisabled || undefined} tabIndex={index === Math.min(focusedRow, visible.length - 1) ? 0 : -1} onFocus={() => setFocusedRow(index)} onKeyDown={(event) => navigateRow(event, index, key, row)} onClick={onRowClick && !rowDisabled ? (event) => {
                if (!(event.target as HTMLElement).closest('button, a, input, select, textarea')) onRowClick(row);
              } : undefined}>
                {selectable && <td className="ds-table-check"><input type="checkbox" aria-label={`Select row ${String(key)}`} checked={selection.has(key)} disabled={rowDisabled} onChange={() => toggleRow(key)} /></td>}
                {numbered && <td className="ds-table-index">{String(offset + index + 1).padStart(2, '0')}</td>}
                {columns.map((column) => {
                  const value = readValue(row, column.key);
                  const content = column.render ? column.render(value, row, originalIndex) : value == null ? '—' : String(value);
                  return <td key={String(column.key)} data-tone={typeof column.tone === 'function' ? column.tone(row) : column.tone} style={{ textAlign: column.align ?? (column.numeric ? 'right' : 'left'), width: column.width }}><CellText truncate={column.truncate ?? false}>{content}</CellText></td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      {pagination && <div className="ds-table-footer"><span aria-live="polite">{rows.length === 0 ? '0 records' : `${offset + 1}–${Math.min(offset + size, rows.length)} of ${rows.length} records`}{selected.length > 0 && ` · ${selected.length} selected`}</span><Pagination page={currentPage} pageCount={pageCount} disabled={disabled || loading} onPageChange={(next) => { setPage(next); setFocusedRow(0); }} /></div>}
    </div>
  );
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page?: number;
  defaultPage?: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ page, defaultPage = 1, pageCount, onPageChange, disabled, className, ...props }: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const total = Math.max(1, Math.floor(pageCount) || 1);
  const current = Math.min(total, Math.max(1, page ?? internalPage));
  const change = (next: number) => { if (page === undefined) setInternalPage(next); onPageChange?.(next); };
  const pages = [...new Set([1, current - 1, current, current + 1, total])].filter((value) => value >= 1 && value <= total).sort((a, b) => a - b);
  return <nav aria-label="Pagination" className={classes('ds-pagination', className)} {...props}>
    <button type="button" aria-label="Previous page" disabled={disabled || current <= 1} onClick={() => change(current - 1)}>←</button>
    {pages.map((value, index) => <span className="ds-pagination-item" key={value}>{index > 0 && value - pages[index - 1] > 1 && <span className="ds-pagination-ellipsis" aria-hidden="true">…</span>}<button type="button" aria-label={`Page ${value}`} aria-current={current === value ? 'page' : undefined} disabled={disabled} onClick={() => change(value)}>{String(value).padStart(2, '0')}</button></span>)}
    <button type="button" aria-label="Next page" disabled={disabled || current >= total} onClick={() => change(current + 1)}>→</button>
  </nav>;
}

export interface FigureProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  index?: string | number;
  title: ReactNode;
  stats?: readonly ReactNode[];
  caption?: ReactNode;
}

export function Figure({ index, title, stats, caption, className, children, ...props }: FigureProps) {
  const titleId = useId();
  return <figure className={classes('ds-figure', className)} aria-labelledby={titleId} {...props}>
    <div className="ds-figure-header"><span className="ds-figure-index">FIGURE {index ?? '01'}</span><strong id={titleId}>{title}</strong>{stats && <span className="ds-figure-stats">{stats.map((stat, position) => <span key={position}>{stat}</span>)}</span>}</div>
    <div className="ds-figure-body">{children}</div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

export interface AnnotationProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  leader?: boolean;
}

export function Annotation({ title, side = 'left', leader = true, children, className, ...props }: AnnotationProps) {
  return <aside className={classes('ds-annotation', leader && 'ds-annotation-leader', className)} data-side={side} {...props}>{title && <strong>{title}</strong>}<div>{children}</div></aside>;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: string;
  language?: string;
  filename?: string;
  lineNumbers?: boolean;
  startLine?: number;
  wrap?: boolean;
  copyable?: boolean;
  highlightLines?: readonly number[];
}

export function CodeBlock({ children, language = 'text', filename, lineNumbers = true, startLine = 1, wrap = false, copyable = true, highlightLines = [], className, ...props }: CodeBlockProps) {
  const [copyState, setCopyState] = useState('Copy');
  useEffect(() => {
    if (copyState === 'Copy') return;
    const timer = setTimeout(() => setCopyState('Copy'), 2500);
    return () => clearTimeout(timer);
  }, [copyState]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(children); setCopyState('Copied'); }
    catch { setCopyState('Copy failed'); }
  };
  return <div className={classes('ds-code-block', className)} {...props}>
    <div className="ds-code-header"><span>{filename ?? language}</span>{copyable && <button type="button" onClick={copy} aria-label="Copy code"><span aria-live="polite">{copyState}</span><span aria-hidden="true"> ⧉</span></button>}</div>
    <pre className={wrap ? 'ds-code-wrap' : undefined} tabIndex={0} aria-label={`${language} code`}><code>{children.split('\n').map((line, index) => <span className="ds-code-line" data-highlighted={highlightLines.includes(startLine + index) || undefined} key={index}>{lineNumbers && <span className="ds-code-line-number" aria-hidden="true">{startLine + index}</span>}<span className="ds-code-line-content">{line || '\u00a0'}{index < children.split('\n').length - 1 ? '\n' : ''}</span></span>)}</code></pre>
  </div>;
}

export interface LogEntry {
  id?: Key;
  timestamp: string;
  message: string;
  level?: DataTone;
  detail?: string;
}

export interface LogViewerProps extends HTMLAttributes<HTMLDivElement> {
  entries: readonly LogEntry[];
  lineNumbers?: boolean;
  wrap?: boolean;
  maxHeight?: CSSProperties['maxHeight'];
  label?: string;
}

export function LogViewer({ entries, lineNumbers = true, wrap = false, maxHeight = 320, label = 'Event log', className, ...props }: LogViewerProps) {
  const [filter, setFilter] = useState('all');
  const visible = entries.filter((entry) => filter === 'all' || (entry.level ?? 'neutral') === filter);
  return <div className={classes('ds-log-viewer', className)} {...props}>
    <div className="ds-code-header"><span>{label} / {visible.length} entries</span><label>LEVEL <select aria-label="Filter log level" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">ALL</option>{(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => <option key={tone} value={tone}>{tone.toUpperCase()}</option>)}</select></label></div>
    <div className={classes('ds-log-content', wrap && 'ds-log-wrap')} role="log" aria-label={label} tabIndex={0} style={{ maxHeight }}>
      {visible.length === 0 ? <EmptyState title="No log entries" description="No entries match this level." /> : visible.map((entry, index) => <div className="ds-log-line" key={entry.id ?? index}>{lineNumbers && <span className="ds-code-line-number" aria-hidden="true">{index + 1}</span>}<time>{entry.timestamp}</time><span className="ds-log-level" data-tone={entry.level ?? 'neutral'}>{entry.level ?? 'neutral'}</span><span className="ds-log-message">{entry.message}{entry.detail && <span className="ds-log-detail"> {entry.detail}</span>}</span></div>)}
    </div>
  </div>;
}

function formatJSON(value: unknown): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(value, (_key, item: unknown) => {
    if (typeof item === 'bigint') return item.toString();
    if (item && typeof item === 'object') { if (seen.has(item)) return '[Circular]'; seen.add(item); }
    return item;
  }, 2) ?? String(value);
}

export interface JSONViewerProps extends Omit<CodeBlockProps, 'children' | 'language'> { value: unknown }
export function JSONViewer({ value, ...props }: JSONViewerProps) { return <CodeBlock language="json" {...props}>{formatJSON(value)}</CodeBlock>; }

export interface KeyValueProps extends HTMLAttributes<HTMLDivElement> { label: ReactNode; value: ReactNode }
export function KeyValue({ label, value, className, ...props }: KeyValueProps) { return <div className={classes('ds-key-value', className)} {...props}><dt>{label}</dt><dd>{value}</dd></div>; }
export interface KeyValueListProps extends HTMLAttributes<HTMLDListElement> { items: readonly (readonly [ReactNode, ReactNode])[]; columns?: 1 | 2 | 3 | 4 }
export function KeyValueList({ items, columns = 1, className, style, ...props }: KeyValueListProps) { return <dl className={classes('ds-key-value-list', className)} style={{ '--dossier-kv-columns': columns, ...style } as CSSProperties} {...props}>{items.map(([label, value], index) => <KeyValue label={label} value={value} key={index} />)}</dl>; }

export interface AuditItem { id?: Key; timestamp: string; dateTime?: string; title: ReactNode; description?: ReactNode; actor?: ReactNode; metadata?: ReactNode; tone?: DataTone }
export interface AuditTimelineProps extends HTMLAttributes<HTMLOListElement> { items: readonly AuditItem[] }
export function AuditTimeline({ items, className, ...props }: AuditTimelineProps) {
  return <ol className={classes('ds-audit-timeline', className)} aria-label="Audit timeline" {...props}>{items.map((item, index) => <li key={item.id ?? index} data-tone={item.tone ?? 'neutral'}><time dateTime={item.dateTime}>{item.timestamp}</time><span className="ds-audit-marker" aria-hidden="true" /><div className="ds-audit-content"><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}{item.actor && <span className="ds-audit-actor">ACTOR / {item.actor}</span>}{item.metadata && <div className="ds-audit-metadata">{item.metadata}</div>}</div></li>)}</ol>;
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { value?: number; max?: number; label?: string; tone?: DataTone; showValue?: boolean }
export function Progress({ value, max = 100, label = 'Progress', tone = 'neutral', showValue = true, className, ...props }: ProgressProps) {
  const id = useId();
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const current = value === undefined ? undefined : Math.min(maximum, Math.max(0, Number.isFinite(value) ? value : 0));
  return <div className={classes('ds-progress', className)} data-tone={tone} {...props}><div className="ds-progress-label"><span id={id}>{label}</span>{showValue && <span>{current === undefined ? 'IN PROGRESS' : `${Math.round(current / maximum * 1000) / 10}%`}</span>}</div><div className="ds-progress-track" role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current}><span className={current === undefined ? 'ds-progress-indeterminate' : undefined} style={{ width: current === undefined ? '30%' : `${current / maximum * 100}%` }} /></div></div>;
}

export interface MeterProps extends Omit<ProgressProps, 'value'> { value: number; min?: number; low?: number; high?: number; optimum?: number }
export function Meter({ value, min = 0, max = 100, label = 'Meter', tone = 'neutral', showValue = true, low, high, optimum, className, ...props }: MeterProps) {
  const id = useId();
  const minimum = Number.isFinite(min) ? min : 0;
  const maximum = Number.isFinite(max) && max > minimum ? max : minimum + 100;
  const current = Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
  return <div className={classes('ds-progress', 'ds-meter', className)} data-tone={tone} {...props}><div className="ds-progress-label"><label htmlFor={id}>{label}</label>{showValue && <span>{current} / {maximum}</span>}</div><meter id={id} value={current} min={minimum} max={maximum} low={low} high={high} optimum={optimum}>{current} / {maximum}</meter></div>;
}

export interface ChartHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { title: ReactNode; description?: ReactNode; action?: ReactNode }
export function ChartHeader({ title, description, action, className, ...props }: ChartHeaderProps) { return <div className={classes('ds-chart-header', className)} {...props}><div><strong>{title}</strong>{description && <p>{description}</p>}</div>{action}</div>; }
export interface ChartFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { title?: ReactNode; description?: ReactNode; footer?: ReactNode }
export function ChartFrame({ title, description, footer, children, className, ...props }: ChartFrameProps) { return <div className={classes('ds-chart-frame', className)} {...props}>{title && <ChartHeader title={title} description={description} />}<div className="ds-chart-body">{children}</div>{footer && <div className="ds-chart-footer">{footer}</div>}</div>; }
export interface ChartLegendItem { label: string; color?: string; value?: ReactNode }
export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> { items: readonly ChartLegendItem[] }
export function ChartLegend({ items, className, ...props }: ChartLegendProps) { return <ul className={classes('ds-chart-legend', className)} aria-label="Chart legend" {...props}>{items.map((item, index) => <li key={index}><span className="ds-chart-swatch" aria-hidden="true" style={{ backgroundColor: item.color ?? 'var(--dossier-ink)' }} />{item.label}{item.value !== undefined && <strong>{item.value}</strong>}</li>)}</ul>; }
export interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> { label?: ReactNode; items: readonly ChartLegendItem[] }
export function ChartTooltip({ label, items, className, ...props }: ChartTooltipProps) { return <div className={classes('ds-chart-tooltip', className)} role="tooltip" {...props}>{label && <strong>{label}</strong>}<ChartLegend items={items} /></div>; }

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { title?: ReactNode; description?: ReactNode; action?: ReactNode }
export function EmptyState({ title = 'No records found', description, action, className, ...props }: EmptyStateProps) { return <div className={classes('ds-empty-state', className)} {...props}><strong>{title}</strong>{description && <p>{description}</p>}{action && <div className="ds-empty-action">{action}</div>}</div>; }
export interface SkeletonTextProps extends HTMLAttributes<HTMLSpanElement> { width?: CSSProperties['width']; lines?: number }
export function SkeletonText({ width = '100%', lines = 1, className, style, ...props }: SkeletonTextProps) { return <span className={classes('ds-skeleton-text', className)} aria-hidden="true" style={{ width, ...style }} {...props}>{Array.from({ length: Math.max(1, lines) }, (_, index) => <span className="ds-skeleton-bar" key={index} />)}</span>; }
export interface SkeletonRowProps extends HTMLAttributes<HTMLDivElement> { columns?: number }
export function SkeletonRow({ columns = 4, className, ...props }: SkeletonRowProps) { return <div className={classes('ds-skeleton-row', className)} aria-hidden="true" {...props}>{Array.from({ length: Math.max(1, columns) }, (_, index) => <SkeletonText key={index} />)}</div>; }
export interface TableSkeletonProps extends HTMLAttributes<HTMLDivElement> { rows?: number; columns?: number; label?: string }
export function TableSkeleton({ rows = 5, columns = 4, label = 'Loading table', className, ...props }: TableSkeletonProps) { return <div className={classes('ds-table-skeleton', className)} role="status" aria-label={label} {...props}>{Array.from({ length: Math.max(1, rows) }, (_, index) => <SkeletonRow columns={columns} key={index} />)}</div>; }
export interface InlineLoaderProps extends HTMLAttributes<HTMLSpanElement> { label?: string }
export function InlineLoader({ label = 'Loading', className, ...props }: InlineLoaderProps) { return <span className={classes('ds-inline-loader', className)} role="status" {...props}><span className="ds-loader-mark" aria-hidden="true" />{label}<span aria-hidden="true">…</span></span>; }
