import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Radio,
  Switch,
  Field,
  Input,
  Textarea,
  Select,
  SearchInput,
  NumberInput,
  Status,
  Tag,
  Metadata,
  Metric,
  MetricRow,
  MetricGroup,
  DocumentHeader,
  Section,
  Rule,
  Grid,
  Stack,
  Inline,
  Heading,
  Meta,
  Body,
  DataTable,
  Figure,
  Annotation,
  CodeBlock,
  LogViewer,
  JSONViewer,
  KeyValueList,
  AuditTimeline,
  Progress,
  ChartFrame,
  ChartLegend,
  EmptyState,
  TableSkeleton,
  InlineLoader,
  Pagination,
  Tabs,
  Sidebar,
  NavGroup,
  NavItem,
  Breadcrumb,
  Dialog,
  Drawer,
  Tooltip,
  Callout,
  useToast,
} from '@dossier-ui/react';
import { Icon } from '@dossier-ui/icons';

export const events = Array.from({ length: 100 }, (_, i) => ({
  id: `node_${String(1048 - i).padStart(6, '0')}`,
  service: ['AUTH_GATEWAY', 'PAYMENT_CORE', 'KAFKA_STREAM', 'SEARCH_ENGINE'][i % 4],
  region: ['US-EAST-1', 'EU-CENTRAL-1', 'AP-SOUTH-1', 'SA-EAST-1'][i % 4],
  status: i % 8 === 3 ? 'FAILED' : i % 6 === 2 ? 'DEGRADED' : 'OPERATIONAL',
  latency: [12, 18, 42, 89, 142, 310, 840, 16][i % 8],
}));

export const eventColumns = [
  { key: 'id', header: 'NODE ID', sortable: true },
  { key: 'service', header: 'SUBSYSTEM', sortable: true },
  { key: 'region', header: 'REGION', sortable: true },
  {
    key: 'status',
    header: 'HEALTH',
    sortable: true,
    render: (value: unknown) => (
      <Status tone={value === 'FAILED' ? 'danger' : value === 'DEGRADED' ? 'warning' : 'success'}>
        {String(value)}
      </Status>
    ),
  },
  {
    key: 'latency',
    header: 'P99 LATENCY',
    numeric: true,
    sortable: true,
    render: (value: unknown) => `${value}ms`,
  },
];

export const logs = [
  { timestamp: '14:20:01.103', message: 'COFFEE_MAKER_READY', detail: 'Dark roast initialized · 92°C pressure nominal', level: 'success' as const },
  { timestamp: '14:20:01.117', message: 'KUBERNETES_HEURISTIC', detail: 'All 32 microservices survived the morning standup', level: 'info' as const },
  { timestamp: '14:20:02.220', message: 'DNS_PROPAGATION', detail: "It's not DNS. There's no way it's DNS. It was DNS.", level: 'neutral' as const },
  { timestamp: '14:20:02.482', message: 'PAYLOAD_DELIVERED', detail: 'HTTP 200 OK · 14ms latency · 0 developers harmed', level: 'success' as const },
  { timestamp: '14:20:04.891', message: 'FRIDAY_DEPLOY_DETECTED', detail: 'Warning: 4:59 PM deploy initiated by courageous engineer', level: 'warning' as const },
];

export function SampleChart({ small = false }: { small?: boolean }) {
  const bars = [29, 36, 31, 48, 43, 55, 40, 51, 64, 48, 69, 57, 72, 65, 78, 60, 70, 82, 71, 85, 64, 74, 80, 95, 76, 88, 71, 82, 91, 77, 96, 84, 90, 72, 85, 97, 86, 94, 78, 89, 100, 85, 92, 79, 91, 102, 87, 95];
  return (
    <svg className={`sample-chart ${small ? 'sample-chart--small' : ''}`} viewBox="0 0 640 170" role="img" aria-label="Illustrative hourly event throughput, increasing from 290 to 950 events">
      <g className="chart-grid">{[30, 65, 100, 135].map((y) => <line key={y} x1="36" x2="626" y1={y} y2={y} />)}</g>
      <g className="chart-labels">
        <text x="0" y="34">1K</text>
        <text x="0" y="104">500</text>
        <text x="36" y="160">00:00</text>
        <text x="181" y="160">06:00</text>
        <text x="327" y="160">12:00</text>
        <text x="477" y="160">18:00</text>
        <text x="594" y="160">23:59</text>
      </g>
      <g>
        {bars.map((h, i) => (
          <rect key={i} x={38 + i * 12.15} y={135 - h} width="6" height={h} fill={i > 37 ? 'var(--dossier-accent-green)' : 'var(--dossier-ink)'} opacity={i > 37 ? 0.85 : 0.7} />
        ))}
      </g>
      <path d="M38 95 L74 87 L110 94 L146 80 L182 83 L218 64 L254 71 L290 52 L326 64 L362 47 L398 55 L434 42 L470 49 L506 35 L542 43 L578 27 L614 34" fill="none" stroke="var(--dossier-accent-red)" strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  );
}

export function ComponentDemo({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(72);
  const [query, setQuery] = useState('');
  const [cleared, setCleared] = useState(false);

  const save = () => toast({ title: 'Configuration saved', description: 'Changes deployed to production. Keep your fingers crossed.', tone: 'success' });

  switch (id) {
    case 'button':
      return (
        <Stack>
          <Inline>
            <Button variant="solid" onClick={save}>
              Deploy to production <Icon name="arrow-up-right" size={14} />
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Inspection complete', description: 'Zero lint errors found. The team rejoices.', tone: 'info' })}>
              Review configuration
            </Button>
            <Button variant="ghost" onClick={() => toast({ title: 'Crisis averted', description: 'Action safely cancelled.' })}>
              Cancel
            </Button>
          </Inline>
          <Inline>
            <Button variant="danger" onClick={() => setOpen(true)}>
              Purge database cache
            </Button>
            <Button disabled>Disabled (No clearance)</Button>
            <Button loading>Deploying to 32 nodes</Button>
          </Inline>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Purge global cache?"
            description="This is a demonstration dialog. No servers were harmed in this preview."
            footer={
              <Button
                variant="danger"
                onClick={() => {
                  setOpen(false);
                  toast({ title: 'Cache purged', description: 'Fresh latency spikes inbound.', tone: 'warning' });
                }}
              >
                Confirm purge
              </Button>
            }
          >
            <p>Database queries will hit origin directly until caches warm up.</p>
          </Dialog>
        </Stack>
      );

    case 'input':
      return (
        <Grid columns={2}>
          <Field label="CLUSTER HOSTNAME" help="Internal FQDN or cluster label.">
            <Input placeholder="e.g. hyper-relay-01.internal" />
          </Field>
          <Field label="API KEY" error="Invalid checksum. Did your cat walk on the keyboard?">
            <Input defaultValue="sk_live_deadbeef_invalid" />
          </Field>
          <Field label="SECURITY CLEARANCE">
            <Input value="LEVEL-5 // TOP SECRET" readOnly />
          </Field>
          <Field label="DEPRECATED ENDPOINT">
            <Input value="v1/legacy (Sunsetting soon)" disabled />
          </Field>
        </Grid>
      );

    case 'select':
      return (
        <Field label="DEPLOYMENT REGION" help="Deploy closest to where your lowest latency infrastructure lives.">
          <Select defaultValue="us-east-1">
            <option value="us-east-1">US East · N. Virginia (Primary)</option>
            <option value="eu-central-1">Europe · Frankfurt (GDPR Compliant)</option>
            <option value="ap-south-1">Asia Pacific · Mumbai (High Throughput)</option>
          </Select>
        </Field>
      );

    case 'checkbox':
      return (
        <Stack>
          <Checkbox label="Bypass staging and deploy directly to prod" />
          <Checkbox label="Send high-priority alerts to pager" defaultChecked />
          <Checkbox label="Immutable cluster governance policy" disabled defaultChecked />
        </Stack>
      );

    case 'radio':
      return (
        <fieldset className="demo-fieldset">
          <legend>LOG VERBOSITY</legend>
          <Radio name="log" value="info" label="Standard (Info)" defaultChecked />
          <Radio name="log" value="debug" label="Verbose (Debug)" />
          <Radio name="log" value="trace" label="Everything (Dump memory on screen)" />
        </fieldset>
      );

    case 'switch':
      return (
        <Stack>
          <Switch label="Autonomous failover circuit" defaultChecked />
          <Switch label="Strict TLS 1.3 verification" defaultChecked />
          <Switch label="Auto-brew coffee during high CPU" />
        </Stack>
      );

    case 'textarea':
      return (
        <Field label="INCIDENT POST-MORTEM" help="Briefly explain what went wrong and why it was definitely DNS.">
          <Textarea rows={4} placeholder="At 14:02 UTC, an intrepid engineer attempted a Friday afternoon deploy..." />
        </Field>
      );

    case 'search-input':
      return (
        <Stack>
          <SearchInput
            aria-label="Filter active microservices"
            placeholder="Search microservices, pods, clusters…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Meta>
            {['AUTH_GATEWAY', 'PAYMENT_CORE', 'KAFKA_STREAM', 'SEARCH_ENGINE']
              .filter((p) => p.toLowerCase().includes(query.toLowerCase()))
              .join(' // ') || 'Zero matching services'}
          </Meta>
        </Stack>
      );

    case 'number-input':
      return (
        <Field label="RETRY ATTEMPTS" help="Between 1 and 10 retries before sounding the alarms.">
          <NumberInput min={1} max={10} defaultValue={3} />
        </Field>
      );

    case 'data-table':
      return <DataTable columns={eventColumns} rows={events} getRowId={(r) => r.id} numbered selectable pagination pageSize={5} caption="Active infrastructure nodes" />;

    case 'metric':
      return (
        <MetricGroup>
          <Metric label="COFFEE RESERVES" value="48.2 L" trend="+14% vs sprint start" />
          <Metric label="UPTIME SLA" value="99.99%" tone="success" />
          <Metric label="P99 LATENCY" value="14ms" tone="info" />
        </MetricGroup>
      );

    case 'metric-row':
      return (
        <Stack>
          <MetricRow label="CLUSTER HEALTH" description="LAST 24 HOURS" value="100.0%" tone="green" />
          <MetricRow label="BUGS SHIPPED TODAY" value="0" description="Officially reported" tone="green" />
          <MetricRow label="FRIDAY DEPLOYS" value="1" tone="danger" description="WARNING // HIGH RISK" />
        </Stack>
      );

    case 'status':
      return (
        <Inline>
          <Status tone="success">Operational</Status>
          <Status tone="warning">Degraded</Status>
          <Status tone="danger">Meltdown</Status>
          <Status tone="info">Syncing</Status>
          <Status>Idle</Status>
        </Inline>
      );

    case 'tag':
      return (
        <Inline>
          <Tag index="01" tone="info">PROD-ALPHA</Tag>
          <Tag variant="technical">SHA-256</Tag>
          <Tag variant="filled">STABLE</Tag>
          <Tag variant="muted">v0.1.1</Tag>
          <Tag tone="red">CRITICAL</Tag>
        </Inline>
      );

    case 'metadata':
      return (
        <Metadata
          items={[
            { label: 'ORG', value: 'ACME-INFRA' },
            { label: 'CLUSTER', value: 'US-EAST-1A' },
            { label: 'CLEARANCE', value: 'TOP-SECRET' },
            { label: 'CHAOS', value: 'NOMINAL' },
          ]}
        />
      );

    case 'key-value':
      return (
        <KeyValueList
          columns={2}
          items={[
            ['PROJECT', 'PROJECT-HERMES'],
            ['SUBSYSTEM', 'NEURAL-CORE'],
            ['CLUSTER', 'US-EAST-1A'],
            ['LATENCY', '14ms'],
          ]}
        />
      );

    case 'audit-timeline':
      return (
        <AuditTimeline
          items={[
            { timestamp: '16:59:02', title: 'COMMIT PUSHED', actor: 'alice', description: 'Fixed typo in production database schema' },
            { timestamp: '16:59:44', title: 'PIPELINE FAILED', actor: 'ci-bot', description: 'Unit test suite exploded with 42 errors', tone: 'danger' },
            { timestamp: '17:01:12', title: 'ROLLBACK DEPLOYED', actor: 'bob', description: 'Reverted commit. Heart rate returned to normal.', tone: 'success' },
          ]}
        />
      );

    case 'progress':
      return (
        <Stack>
          <Progress value={progress} label="MEMORY UTILIZATION" tone={progress > 80 ? 'danger' : 'success'} />
          <Progress value={99.8} label="COFFEE LEVEL" tone="success" />
          <ButtonGroup>
            <Button size="sm" disabled={progress === 0} onClick={() => setProgress((p) => Math.max(0, p - 10))}>
              − 10%
            </Button>
            <Button size="sm" disabled={progress === 100} onClick={() => setProgress((p) => Math.min(100, p + 10))}>
              + 10%
            </Button>
          </ButtonGroup>
        </Stack>
      );

    case 'document-header':
      return (
        <DocumentHeader
          kicker="GLOBAL TELEMETRY // SECTOR 7"
          title="CORE REACTOR CONTROL PLANE"
          metadata={[
            ['ENV', 'PRODUCTION'],
            ['CLUSTER', 'PROD-EAST-01'],
            ['CHAOS', 'NOMINAL'],
          ]}
        />
      );

    case 'section':
      return (
        <Section index="[03]" title="Hardware Diagnostics" description="Realtime sensor readings from the server rack.">
          <MetricRow label="ALL SENSORS NOMINAL" value="64 / 64" tone="success" />
        </Section>
      );

    case 'rule':
      return (
        <Stack>
          <Rule label="SECTION 02 // INCIDENT LOGS" />
          <Rule weight="heavy" />
          <Rule variant="double" />
          <Rule variant="dashed" />
          <Rule variant="dotted" />
        </Stack>
      );

    case 'figure':
      return (
        <Figure index="FIG-01" title="HOURLY TELEMETRY THROUGHPUT" stats={['1.2M OPS/SEC', '99.99% HEALTH']} caption="Hourly throughput profile. Dashed line indicates previous 24h baseline.">
          <SampleChart />
        </Figure>
      );

    case 'annotation':
      return (
        <Annotation title="INCIDENT ADVISORY" side="left">
          Power fluctuation resolved. The coffee machine was unplugged from the main server rack breaker.
        </Annotation>
      );

    case 'tabs':
      return (
        <Tabs defaultValue="overview">
          <Tabs.List aria-label="Console tabs">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="telemetry">Telemetry</Tabs.Trigger>
            <Tabs.Trigger value="logs">Incident Logs</Tabs.Trigger>
            <Tabs.Trigger value="classified" disabled>Classified</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            <KeyValueList columns={2} items={[['SYSTEM', 'HERMES-CORE'], ['STATUS', 'ACTIVE'], ['REGION', 'US-EAST-1'], ['CHAOS', '0.00%']]} />
          </Tabs.Content>
          <Tabs.Content value="telemetry">
            <DataTable rows={events.slice(0, 3)} columns={eventColumns} />
          </Tabs.Content>
          <Tabs.Content value="logs">
            <Callout title="LOG RETENTION POLICY">All incident logs retained for 30 days unless subpoenaed.</Callout>
          </Tabs.Content>
        </Tabs>
      );

    case 'sidebar':
      return (
        <div className="sidebar-specimen">
          <Sidebar>
            <NavGroup title="MISSION CONTROL">
              <NavItem href="#/sidebar" index="01" active>Overview</NavItem>
              <NavItem href="#/data-table" index="02">Data Grids</NavItem>
              <NavItem href="#/metadata" index="03">Telemetry</NavItem>
              <NavItem href="#/audit-timeline" index="04">Audit Trail</NavItem>
            </NavGroup>
          </Sidebar>
          <div>
            <Meta>APPLICATION VIEWPORT</Meta>
            <p>Monospace navigation acting as an architectural document index.</p>
          </div>
        </div>
      );

    case 'breadcrumb':
      return (
        <Breadcrumb
          items={[
            { label: 'Documentation', href: '#/overview' },
            { label: 'Components', href: '#/components' },
            { label: 'Breadcrumb' },
          ]}
        />
      );

    case 'pagination':
      return (
        <Stack>
          <Meta>PAGE {page} OF 10</Meta>
          <Pagination page={page} pageCount={10} onPageChange={setPage} />
        </Stack>
      );

    case 'dialog':
      return (
        <>
          <Button onClick={() => setOpen(true)}>
            Open Dialog <Icon name="external" size={14} />
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Initiate Production Rollout"
            description="Deploying build v0.1.1 to 128 edge nodes."
            footer={
              <Inline>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  onClick={() => {
                    setOpen(false);
                    save();
                  }}
                >
                  Confirm Deploy
                </Button>
              </Inline>
            }
          >
            <KeyValueList items={[['ENVIRONMENT', 'PRODUCTION'], ['REGION', 'GLOBAL-MESH'], ['SANITY CHECKS', '100% PASSED']]} />
          </Dialog>
        </>
      );

    case 'drawer':
      return (
        <>
          <Button onClick={() => setOpen(true)}>
            Inspect Node <Icon name="arrow-right" size={14} />
          </Button>
          <Drawer open={open} onOpenChange={setOpen} title="Node Diagnostics" description="Telemetry record node_001048">
            <Stack>
              <Status tone="success">Operational</Status>
              <KeyValueList items={[['NODE ID', 'node_001048'], ['REGION', 'US-EAST-1'], ['LATENCY', '14ms']]} />
              <ComponentDemo id="audit-timeline" />
            </Stack>
          </Drawer>
        </>
      );

    case 'toast':
      return (
        <Inline>
          <Button onClick={save}>Success Notice</Button>
          <Button onClick={() => toast({ title: 'Coffee Machine Empty', description: 'Please refill the hopper before continuing.', tone: 'warning' })}>
            Warning Notice
          </Button>
          <Button variant="danger" onClick={() => toast({ title: 'Deploy Failed', description: 'Index was out of bounds. Intern has been notified.', tone: 'danger' })}>
            Error Notice
          </Button>
        </Inline>
      );

    case 'tooltip':
      return (
        <Inline>
          <Tooltip content="Kubernetes Out-Of-Memory termination signal">
            <Button onClick={() => toast({ title: 'Tooltip clicked', tone: 'info' })}>
              Hover for acronym translation
            </Button>
          </Tooltip>
        </Inline>
      );

    case 'callout':
      return (
        <Stack>
          <Callout tone="info" title="RETENTION POLICY">Incident logs are archived for 30 days unless requested by compliance.</Callout>
          <Callout tone="warning" title="FRIDAY DEPLOY ADVISORY">Deploying after 4 PM on a Friday is known to the State of California to cause weekend regret.</Callout>
          <Callout tone="success" title="ALL SYSTEMS NOMINAL">0 active incidents. You are free to enjoy your espresso.</Callout>
        </Stack>
      );

    case 'empty-state':
      return cleared ? (
        <DataTable columns={eventColumns} rows={events.slice(0, 3)} />
      ) : (
        <EmptyState
          title="ZERO INCIDENTS FOUND"
          description="Either your software is completely bug-free, or the monitoring daemon crashed."
          action={<Button onClick={() => setCleared(true)}>Reload Telemetry</Button>}
        />
      );

    case 'loading':
      return (
        <Stack>
          <TableSkeleton rows={4} columns={4} />
          <InlineLoader label="Querying galactic database" />
        </Stack>
      );

    case 'code-block':
      return (
        <CodeBlock language="tsx" filename="MissionControl.tsx" lineNumbers>
          {'import { Button, DocumentHeader } from "@vikramaditya1010/react";\nimport "@vikramaditya1010/react/styles.css";\n\nexport function App() {\n  return (\n    <div>\n      <DocumentHeader title="MISSION CONTROL" />\n      <Button variant="solid">Deploy Changes</Button>\n    </div>\n  );\n}'}
        </CodeBlock>
      );

    case 'log-viewer':
      return <LogViewer entries={logs} lineNumbers />;

    case 'json-viewer':
      return <JSONViewer value={{ status: 'operational', cluster: 'us-east-1', activeNodes: 64, latencyMs: 14, coffeeLevelPercent: 99.8, chaosMode: false }} />;

    case 'chart-frame':
      return (
        <ChartFrame title="REQUEST THROUGHPUT" description="Operations per second over the last 24 hours">
          <SampleChart />
          <ChartLegend items={[{ label: 'Current 24h cycle', color: 'var(--dossier-ink)' }, { label: 'Historical baseline', color: 'var(--dossier-accent-red)' }]} />
        </ChartFrame>
      );

    default:
      return <Body>Select a component from the index.</Body>;
  }
}

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = events.filter(
    (e) => (status === 'all' || e.status === status) && Object.values(e).some((v) => String(v).toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="dashboard">
      <DocumentHeader
        kicker="MISSION CONTROL // TELEMETRY CONSOLE"
        title="GLOBAL INFRASTRUCTURE & COFFEE STATUS"
        metadata={[
          ['ENV', 'PRODUCTION'],
          ['CLEARANCE', 'TOP-SECRET'],
          ['REGION', 'GLOBAL-MESH'],
          ['INCIDENTS', '0 (TODAY)'],
        ]}
      />

      <div className="dashboard-toolbar">
        <Status tone="success">All systems nominal</Status>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Icon name="settings" size={14} /> Configure
        </Button>
      </div>

      <MetricGroup>
        <Metric label="COFFEE RESERVES" value="48.2 L" trend="+14% vs sprint start" />
        <Metric label="UPTIME SLA" value="99.99%" tone="success" />
        <Metric label="BUGS REPORTED" value="0" tone="success" />
        <Metric label="P99 LATENCY" value="14ms" tone="info" />
      </MetricGroup>

      <Figure index="FIG-01" title="HOURLY TRAFFIC PROFILE" stats={['24 HOURS', '64 NODES']} caption="Hourly throughput volume across global cluster. Red dashed line indicates baseline.">
        <SampleChart />
      </Figure>

      <Tabs defaultValue="events">
        <Tabs.List aria-label="Dashboard sections">
          <Tabs.Trigger value="events">Active Nodes</Tabs.Trigger>
          <Tabs.Trigger value="audit">Audit Trail</Tabs.Trigger>
          <Tabs.Trigger value="logs">Live Telemetry Logs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="events">
          <div className="dashboard-filters">
            <SearchInput aria-label="Filter nodes" placeholder="Filter nodes, services, regions…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select aria-label="Filter by health" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Health States</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="DEGRADED">Degraded</option>
              <option value="FAILED">Failed</option>
            </Select>
            <Meta>{filtered.length} NODES</Meta>
          </div>
          <DataTable columns={eventColumns} rows={filtered} getRowId={(e) => e.id} selectable numbered pagination pageSize={5} />
        </Tabs.Content>

        <Tabs.Content value="audit">
          <ComponentDemo id="audit-timeline" />
        </Tabs.Content>

        <Tabs.Content value="logs">
          <LogViewer entries={logs} />
        </Tabs.Content>
      </Tabs>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Mission Control Settings"
        description="Configure runtime parameters and chaos thresholds."
        footer={
          <Button
            variant="solid"
            onClick={() => {
              setOpen(false);
              toast({ title: 'Configuration Saved', description: 'Changes deployed to production. Good luck.', tone: 'success' });
            }}
          >
            Save Parameters
          </Button>
        }
      >
        <Stack>
          <Field label="CLUSTER CODENAME">
            <Input defaultValue="Deep Thought 42" />
          </Field>
          <Field label="PANIC THRESHOLD" help="Alert escalates when panic rating exceeds 7.">
            <NumberInput min={1} max={10} defaultValue={7} />
          </Field>
          <Switch label="Auto-brew espresso when CPU load exceeds 90%" defaultChecked />
        </Stack>
      </Dialog>
    </div>
  );
}

export function LayoutExample() {
  return (
    <Stack>
      <Grid columns={12}>
        <Grid.Item span={8}>
          <div className="layout-cell">PRIMARY / 8 COLS</div>
        </Grid.Item>
        <Grid.Item span={4}>
          <div className="layout-cell">TELEMETRY / 4 COLS</div>
        </Grid.Item>
      </Grid>
      <Grid columns={3}>
        {['01', '02', '03'].map((n) => (
          <div className="layout-cell" key={n}>
            {n} / EQUAL COLUMN
          </div>
        ))}
      </Grid>
      <Inline>
        <Tag>COMPACT</Tag>
        <Tag>DEFAULT</Tag>
        <Tag>COMFORTABLE</Tag>
      </Inline>
    </Stack>
  );
}

export function TypographyExample() {
  return (
    <div className="type-specimen">
      <div>
        <Meta>DISPLAY // 32PX</Meta>
        <Heading>BUILT FOR COLD BREW AND RFCs.</Heading>
      </div>
      <div>
        <Meta>HEADING // 26PX</Meta>
        <h2>Zero rounded bubblegum buttons.</h2>
      </div>
      <div>
        <Meta>BODY // 14PX</Meta>
        <Body>Every pixel, ruled line, and tabular number earns its place.</Body>
      </div>
      <div>
        <Meta>METADATA // 11PX</Meta>
        <Meta>ORG ACME // SECTOR 7 // US-EAST-1 // 99.99% NOMINAL</Meta>
      </div>
      <div>
        <Meta>TABULAR NUMERALS // ALIGNED</Meta>
        <span className="type-numerals">0123456789 — $1,248,930.42 (14ms)</span>
      </div>
    </div>
  );
}
