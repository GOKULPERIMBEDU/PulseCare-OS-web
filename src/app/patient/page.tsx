import { Link } from 'react-router-dom';
import { Appointment, Invoice } from '@/types';
import { entityName } from '@/lib/format';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge, PaymentBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function PatientHomePage() {
  const { money } = useMoney();
  const appointmentsQuery = useApiResource<Appointment[]>('/appointments');
  const invoicesQuery = useApiResource<Invoice[]>('/billing');
  const appointments = appointmentsQuery.data ?? [];
  const invoices = invoicesQuery.data ?? [];
  const loading = appointmentsQuery.loading || invoicesQuery.loading;
  const error = appointmentsQuery.error || invoicesQuery.error;

  const nextVisit = appointments.find(
    (item) => item.status === 'Scheduled' || item.status === 'Waiting',
  );

  return (
    <div>
      <PageHeader
        eyebrow="Patient portal"
        title="Your care at a glance"
        description="Upcoming visits, live clinic status, history, and invoices."
        actions={
          <Link to="/patient/book">
            <Button>Book appointment</Button>
          </Link>
        }
      />
      {error ? <QueryError message={error} /> : null}
      {loading ? <LoadingState /> : null}
      {!loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="pc-card p-5">
            <h2 className="text-sm font-semibold">Next visit</h2>
            {nextVisit ? (
              <div className="mt-3">
                <p className="text-xl font-semibold">
                  {nextVisit.date} · {nextVisit.timeSlot}
                </p>
                <p className="text-sm text-muted">{entityName(nextVisit.doctorId)}</p>
                <div className="mt-2">
                  <StatusBadge status={nextVisit.status} />
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState message="No data available" />
              </div>
            )}
          </article>
          <article className="pc-card p-5">
            <h2 className="text-sm font-semibold">Latest invoice</h2>
            {invoices[0] ? (
              <div className="mt-3">
                <p className="text-xl font-semibold">{money(invoices[0].totalAmount)}</p>
                <p className="text-sm text-muted">{invoices[0].invoiceNumber}</p>
                <div className="mt-2">
                  <PaymentBadge status={invoices[0].paymentStatus} />
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState message="No data available" />
              </div>
            )}
          </article>
        </div>
      ) : null}
    </div>
  );
}
