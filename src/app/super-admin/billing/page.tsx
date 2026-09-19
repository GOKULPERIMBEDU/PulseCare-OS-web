'use client';

import { api } from '@/lib/api';
import { SaaSInvoice } from '@/types';
import { formatDate, money } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { PaymentBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QueryError } from '@/components/ui/DataState';

function hospitalName(item: SaaSInvoice): string {
  if (typeof item.hospitalId === 'string') return item.hospitalId;
  return item.hospitalId?.name ?? '—';
}

export default function SuperAdminBillingPage() {
  const { data, loading, error, reload } = useApiResource<SaaSInvoice[]>('/platform/saas-billing');
  const items = data ?? [];

  async function markPaid(id: string) {
    await api(`/platform/saas-billing/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Paid' }),
    });
    await reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="SaaS billing"
        title="Hospital subscriptions"
        description="Payments from hospitals to the PulseCare platform owner. Separate from patient clinical invoices."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Invoice', 'Hospital', 'Plan', 'Amount', 'Period', 'Status', '']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3 font-mono text-xs">{item.invoiceNumber}</td>
            <td className="px-4 py-3">{hospitalName(item)}</td>
            <td className="px-4 py-3 capitalize">{item.plan}</td>
            <td className="px-4 py-3">{money(item.amount, item.currency)}</td>
            <td className="px-4 py-3 text-muted">
              {formatDate(item.periodStart)} – {formatDate(item.periodEnd)}
            </td>
            <td className="px-4 py-3">
              {item.status === 'Overdue' ? (
                <span className="inline-flex rounded-full bg-danger-soft px-2.5 py-1 text-xs font-medium text-danger">
                  Overdue
                </span>
              ) : (
                <PaymentBadge status={item.status} />
              )}
            </td>
            <td className="px-4 py-3">
              {item.status !== 'Paid' ? (
                <Button variant="secondary" onClick={() => void markPaid(item._id)}>
                  Mark paid
                </Button>
              ) : null}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
