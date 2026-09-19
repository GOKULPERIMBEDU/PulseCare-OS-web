'use client';

import { Appointment, Patient, Prescription } from '@/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useApiResource } from '@/hooks/useApiResource';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function PatientRecordsPage() {
  const { profileId } = useAuth();
  const visitsQuery = useApiResource<Appointment[]>('/appointments');
  const rxQuery = useApiResource<Prescription[]>('/prescriptions');
  const patientQuery = useApiResource<Patient>(profileId ? `/patients/${profileId}` : null);
  const visits = visitsQuery.data ?? [];
  const rx = rxQuery.data ?? [];
  const patient = patientQuery.data;
  const loading = visitsQuery.loading || rxQuery.loading || patientQuery.loading;
  const error = visitsQuery.error || rxQuery.error || patientQuery.error;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chart"
        title="Medical history"
        description="Visits, conditions, allergies, and prescriptions issued to you."
      />
      {error ? <QueryError message={error} /> : null}
      {loading ? <LoadingState /> : null}
      {!loading && !patient ? <EmptyState /> : null}
      {!loading && patient ? (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="pc-card p-5">
            <h2 className="text-sm font-semibold">Allergies</h2>
            <p className="mt-2 text-sm text-muted">{patient.allergies.join(', ') || 'No data available'}</p>
          </article>
          <article className="pc-card p-5">
            <h2 className="text-sm font-semibold">Conditions</h2>
            <p className="mt-2 text-sm text-muted">
              {patient.chronicConditions.join(', ') || 'No data available'}
            </p>
          </article>
        </div>
      ) : null}
      <section className="pc-card p-5">
        <h2 className="text-sm font-semibold">Visits</h2>
        {!loading && visits.length === 0 ? (
          <div className="mt-3">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {visits.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm">
                <span>
                  {item.date} {item.timeSlot} · {item.reason}
                </span>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="pc-card p-5">
        <h2 className="text-sm font-semibold">Prescriptions</h2>
        {!loading && rx.length === 0 ? (
          <div className="mt-3">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {rx.map((item) => (
              <div key={item._id} className="rounded-xl bg-surface-2 p-3 text-sm">
                <p className="text-muted">{formatDate(item.issuedAt)}</p>
                {item.medications.map((med) => (
                  <p key={med.name}>
                    {med.name} {med.dosage} · {med.frequency}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
