import { Link } from 'react-router-dom';
import { Invoice } from '@/types';
import { formatDate } from '@/lib/format';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { PaymentBadge } from '@/components/ui/Badge';
import { QueryError } from '@/components/ui/DataState';

export default function PatientBillingPage() {
  const { money } = useMoney();
  const { data, loading, error } = useApiResource<Invoice[]>('/billing');
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Invoices"
        description="Consultation, treatment, tax, and payment status. Open an invoice to print or save."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Invoice', 'Date', 'Total', 'Status', '']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3 font-mono text-xs">{item.invoiceNumber}</td>
            <td className="px-4 py-3 text-muted">{formatDate(item.createdAt)}</td>
            <td className="px-4 py-3">{money(item.totalAmount)}</td>
            <td className="px-4 py-3">
              <PaymentBadge status={item.paymentStatus} />
            </td>
            <td className="px-4 py-3">
              <Link className="text-sm text-teal" to={`/patient/billing/${item._id}`}>
                View / download
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
