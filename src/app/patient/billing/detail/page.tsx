import { useParams } from 'react-router-dom';
import { Invoice } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { Button } from '@/components/ui/Button';
import { PaymentBadge } from '@/components/ui/Badge';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function InvoicePage() {
  const params = useParams<{ id: string }>();
  const { hospitalName, baseCurrency } = useAuth();
  const { money } = useMoney();
  const { data: invoice, loading, error } = useApiResource<Invoice>(
    params.id ? `/billing/${params.id}` : null,
  );

  if (loading) return <LoadingState label="Loading invoice…" />;
  if (error) return <QueryError message={error} />;
  if (!invoice) return <EmptyState />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>Print / save PDF</Button>
      </div>
      <article className="pc-card p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-teal">{hospitalName ?? 'PulseCare OS'}</p>
            <h1 className="mt-1 text-2xl font-semibold">Clinical invoice</h1>
            <p className="mt-1 text-xs text-muted">Amounts in {baseCurrency}</p>
          </div>
          <PaymentBadge status={invoice.paymentStatus} />
        </div>
        <p className="mt-4 font-mono text-sm">{invoice.invoiceNumber}</p>
        <p className="text-sm text-muted">{formatDate(invoice.createdAt)}</p>
        <p className="mt-4 text-sm">Bill to {entityName(invoice.patientId)}</p>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Consultation</td>
              <td>1</td>
              <td>{money(invoice.consultationFee)}</td>
            </tr>
            {invoice.treatmentFees > 0 ? (
              <tr>
                <td className="py-2">Treatment</td>
                <td>1</td>
                <td>{money(invoice.treatmentFees)}</td>
              </tr>
            ) : null}
            {invoice.items.map((item) => (
              <tr key={item.description}>
                <td className="py-2">{item.description}</td>
                <td>{item.quantity}</td>
                <td>{money(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 space-y-1 text-right text-sm">
          <p>Subtotal {money(invoice.subtotal)}</p>
          <p>Tax ({Math.round(invoice.taxRate * 100)}%) {money(invoice.taxAmount)}</p>
          <p className="text-lg font-semibold">Total {money(invoice.totalAmount)}</p>
        </div>
      </article>
    </div>
  );
}
