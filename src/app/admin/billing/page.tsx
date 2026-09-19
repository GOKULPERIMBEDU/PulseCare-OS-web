'use client';

import { api } from '@/lib/api';
import { Invoice } from '@/types';
import { entityName } from '@/lib/format';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { PaymentBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QueryError } from '@/components/ui/DataState';

export default function AdminBillingPage() {
  const { money } = useMoney();
  const { data, loading, error, reload } = useApiResource<Invoice[]>('/billing');
  const items = data ?? [];

  async function markPaid(id: string) {
    await api(`/billing/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus: 'Paid' }),
    });
    await reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Finance"
        title="Revenue & invoices"
        description="Consultation fees, treatment line items, tax, and payment status in this hospital’s currency."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Invoice', 'Patient', 'Total', 'Tax', 'Status', '']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3 font-mono text-xs">{item.invoiceNumber}</td>
            <td className="px-4 py-3">{entityName(item.patientId)}</td>
            <td className="px-4 py-3">{money(item.totalAmount)}</td>
            <td className="px-4 py-3 text-muted">{money(item.taxAmount)}</td>
            <td className="px-4 py-3">
              <PaymentBadge status={item.paymentStatus} />
            </td>
            <td className="px-4 py-3">
              {item.paymentStatus === 'Pending' ? (
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
