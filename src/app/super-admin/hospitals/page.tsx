import { PlatformHospital } from '@/types';
import { formatDate, money } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { PaymentBadge } from '@/components/ui/Badge';
import { QueryError } from '@/components/ui/DataState';

export default function SuperAdminHospitalsPage() {
  const { data, loading, error } = useApiResource<PlatformHospital[]>('/platform/hospitals');
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Tenants"
        title="Registered hospitals"
        description="Every onboarded organization and its current SaaS subscription. Clinical records remain isolated per hospitalId."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Hospital', 'Region', 'Currency', 'Plan', 'SaaS status', 'Onboarded']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((hospital) => (
          <tr key={hospital.id}>
            <td className="px-4 py-3">
              <p className="font-medium">{hospital.name}</p>
              <p className="font-mono text-xs text-muted">{hospital.slug}</p>
            </td>
            <td className="px-4 py-3 text-muted">{hospital.region}</td>
            <td className="px-4 py-3">{hospital.baseCurrency}</td>
            <td className="px-4 py-3 capitalize">{hospital.subscription?.plan ?? '—'}</td>
            <td className="px-4 py-3">
              {hospital.subscription ? (
                <div className="space-y-1">
                  <PaymentBadge status={hospital.subscription.status === 'Overdue' ? 'Pending' : hospital.subscription.status} />
                  <p className="text-xs text-muted">
                    {money(hospital.subscription.amount, hospital.subscription.currency)}
                  </p>
                </div>
              ) : (
                '—'
              )}
            </td>
            <td className="px-4 py-3 text-muted">{formatDate(hospital.createdAt)}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
