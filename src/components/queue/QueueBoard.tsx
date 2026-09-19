'use client';

import { AppointmentStatus } from '@/types';
import { entityName } from '@/lib/format';
import { Appointment } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState } from '@/components/ui/DataState';
import { Activity } from 'lucide-react';

const NEXT: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  Scheduled: 'Waiting',
  Waiting: 'In-Consultation',
  'In-Consultation': 'Completed',
};

export function QueueBoard({
  items,
  connected,
  loading = false,
  onStatus,
  compact = false,
}: {
  items: Appointment[];
  connected: boolean;
  loading?: boolean;
  onStatus?: (id: string, status: AppointmentStatus) => void;
  compact?: boolean;
}) {
  const waiting = items.filter((item) => item.status === 'Waiting' || item.status === 'Scheduled');
  const current = items.filter((item) => item.status === 'In-Consultation');
  const done = items.filter((item) => item.status === 'Completed');

  if (loading) {
    return <LoadingState label="Loading live queue…" />;
  }

  if (items.length === 0) {
    return <EmptyState message="No data available" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-ok' : 'bg-warn'}`} />
        {connected ? 'Live queue connected' : 'Reconnecting to queue channel'}
      </div>
      <div className={`grid gap-4 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}`}>
        <Column title="Waiting" count={waiting.length} tone="warn">
          {waiting.length === 0 ? (
            <EmptyState message="No data available" />
          ) : (
            waiting.map((item) => <QueueCard key={item._id} item={item} onStatus={onStatus} />)
          )}
        </Column>
        <Column title="In consultation" count={current.length} tone="teal">
          {current.length === 0 ? (
            <EmptyState message="No data available" />
          ) : (
            current.map((item) => <QueueCard key={item._id} item={item} onStatus={onStatus} />)
          )}
        </Column>
        <Column title="Completed" count={done.length} tone="ok">
          {done.length === 0 ? (
            <EmptyState message="No data available" />
          ) : (
            done.map((item) => <QueueCard key={item._id} item={item} onStatus={onStatus} />)
          )}
        </Column>
      </div>
    </div>
  );
}

function Column({
  title,
  count,
  tone,
  children,
}: {
  title: string;
  count: number;
  tone: 'warn' | 'teal' | 'ok';
  children: React.ReactNode;
}) {
  const tones = {
    warn: 'text-warn',
    teal: 'text-teal',
    ok: 'text-ok',
  };
  return (
    <section className="pc-card min-h-72 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${tones[tone]}`}>{title}</h3>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function QueueCard({
  item,
  onStatus,
}: {
  item: Appointment;
  onStatus?: (id: string, status: AppointmentStatus) => void;
}) {
  const next = NEXT[item.status];
  return (
    <article className="rounded-xl border border-line bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{entityName(item.patientId)}</p>
          <p className="text-xs text-muted">
            {item.timeSlot} · {entityName(item.doctorId)}
          </p>
          <p className="mt-1 text-xs text-muted">{item.reason}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      {onStatus && next ? (
        <Button
          className="mt-3 w-full"
          variant="secondary"
          onClick={() => onStatus(item._id, next)}
        >
          <Activity className="h-4 w-4" />
          Move to {next}
        </Button>
      ) : null}
    </article>
  );
}
