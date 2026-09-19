'use client';

import { Prescription } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function DoctorPrescriptionsPage() {
  const { data, loading, error } = useApiResource<Prescription[]>('/prescriptions');
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Pharmacy"
        title="Issued prescriptions"
        description="Medications, dosage, and counseling notes linked to visits."
      />
      {error ? <QueryError message={error} /> : null}
      {loading ? <LoadingState /> : null}
      {!loading && items.length === 0 ? <EmptyState /> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item._id} className="pc-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{entityName(item.patientId)}</h2>
              <p className="text-sm text-muted">{formatDate(item.issuedAt)}</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {item.medications.map((med) => (
                <li key={med.name}>
                  {med.name} · {med.dosage} · {med.frequency} · {med.duration}
                </li>
              ))}
            </ul>
            {item.notes ? <p className="mt-2 text-sm text-muted">{item.notes}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
