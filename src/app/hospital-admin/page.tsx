'use client';

import { AnalyticsOverview } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader, StatCard } from '@/components/ui/PageHeader';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function AdminDashboardPage() {
  const { hospitalName, baseCurrency } = useAuth();
  const { money } = useMoney();
  const { data, loading, error } = useApiResource<AnalyticsOverview>('/analytics/overview');
  const queueEntries = Object.entries(data?.queue ?? {});

  return (
    <div>
      <PageHeader
        eyebrow="Hospital Admin"
        title={hospitalName ? `${hospitalName} command center` : 'Hospital command center'}
        description={`Census, revenue, and live clinic throughput in ${baseCurrency} for this hospital only.`}
      />
      {error ? <QueryError message={error} /> : null}
      {loading ? <LoadingState label="Loading hospital metrics…" /> : null}
      {!loading && !data ? <EmptyState /> : null}
      {!loading && data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Patients" value={data.patients} />
            <StatCard label="Physicians" value={data.doctors} />
            <StatCard label="Today's visits" value={data.todayAppointments} />
            <StatCard
              label="Collected revenue"
              value={money(data.revenue.collected)}
              hint={`${money(data.revenue.outstanding)} outstanding`}
            />
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="pc-card p-5">
              <h2 className="text-sm font-semibold">Today’s queue mix</h2>
              {queueEntries.length === 0 ? (
                <div className="mt-4">
                  <EmptyState />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {queueEntries.map(([status, count]) => (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{status}</span>
                        <span className="text-muted">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2">
                        <div
                          className="h-2 rounded-full bg-teal"
                          style={{ width: `${Math.min(100, Number(count) * 18)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pc-card p-5">
              <h2 className="text-sm font-semibold">Revenue posture</h2>
              <p className="mt-3 text-3xl font-semibold">{money(data.revenue.collected)}</p>
              <p className="mt-2 text-sm text-muted">
                {data.revenue.paidInvoices} paid invoices · {data.revenue.pendingInvoices} pending
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
