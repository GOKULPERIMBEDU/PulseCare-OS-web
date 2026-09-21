import { Link } from 'react-router-dom';
import { PlatformOverview } from '@/types';
import { money } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader, StatCard } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function SuperAdminPage() {
  const { data, loading, error } = useApiResource<PlatformOverview>('/platform/overview');
  const collected = data?.saasRevenue ?? [];
  const outstanding = data?.saasOutstanding ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Super Admin"
        title="Platform command center"
        description="All registered hospitals, SaaS subscription revenue, and system health. Clinical charts stay inside each hospital tenant."
        actions={
          <Link to="/super-admin/hospitals">
            <Button variant="secondary">View hospitals</Button>
          </Link>
        }
      />
      {error ? <QueryError message={error} /> : null}
      {loading ? <LoadingState label="Loading platform metrics…" /> : null}
      {!loading && !data ? <EmptyState /> : null}
      {!loading && data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Onboarded hospitals"
              value={data.hospitals}
              hint={`${data.activeHospitals} active`}
            />
            <StatCard label="Physicians" value={data.doctors} />
            <StatCard label="Patients" value={data.patients} />
            <StatCard
              label="System health"
              value={data.health.status === 'ok' ? 'Healthy' : 'Degraded'}
              hint={`Database ${data.health.database}`}
            />
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="pc-card p-5">
              <h2 className="text-sm font-semibold">SaaS subscription revenue</h2>
              {collected.length === 0 ? (
                <div className="mt-4">
                  <EmptyState />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-3xl font-semibold">
                    {collected.map((row) => money(row.total, row.currency)).join(' · ')}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {collected.reduce((acc, row) => acc + row.count, 0)} paid invoices
                  </p>
                </>
              )}
            </div>
            <div className="pc-card p-5">
              <h2 className="text-sm font-semibold">Outstanding subscriptions</h2>
              {outstanding.length === 0 ? (
                <div className="mt-4">
                  <EmptyState />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-3xl font-semibold">
                    {outstanding.map((row) => money(row.total, row.currency)).join(' · ')}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {outstanding.reduce((acc, row) => acc + row.count, 0)} pending or overdue
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
