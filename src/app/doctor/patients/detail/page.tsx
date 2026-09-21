import { useParams } from 'react-router-dom';
import { Appointment, Patient, Prescription } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/Badge';
import { DocumentsManager } from '@/components/documents/DocumentsManager';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function DoctorEmrPage() {
  const params = useParams<{ id: string }>();
  const patientQuery = useApiResource<Patient>(params.id ? `/patients/${params.id}` : null);
  const historyQuery = useApiResource<Appointment[]>(params.id ? `/appointments?patientId=${params.id}` : null);
  const rxQuery = useApiResource<Prescription[]>(params.id ? `/prescriptions?patientId=${params.id}` : null);
  const patient = patientQuery.data;
  const history = historyQuery.data ?? [];
  const rx = rxQuery.data ?? [];

  if (patientQuery.loading) return <LoadingState label="Loading chart…" />;
  if (patientQuery.error) return <QueryError message={patientQuery.error} />;
  if (!patient) return <EmptyState />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={patient.mrn}
        title={entityName(patient)}
        description={`${patient.gender} · ${formatDate(patient.dateOfBirth)} · ${patient.phone}`}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="pc-card p-5">
          <h2 className="text-sm font-semibold">Allergies</h2>
          <p className="mt-2 text-sm text-muted">{patient.allergies.join(', ') || 'No data available'}</p>
        </article>
        <article className="pc-card p-5">
          <h2 className="text-sm font-semibold">Chronic conditions</h2>
          <p className="mt-2 text-sm text-muted">{patient.chronicConditions.join(', ') || 'No data available'}</p>
        </article>
        <article className="pc-card p-5">
          <h2 className="text-sm font-semibold">Emergency contact</h2>
          <p className="mt-2 text-sm text-muted">
            {patient.emergencyContacts[0]
              ? `${patient.emergencyContacts[0].name} · ${patient.emergencyContacts[0].phone}`
              : 'No data available'}
          </p>
        </article>
      </div>
      <section className="pc-card p-5">
        <h2 className="text-sm font-semibold">Medical history</h2>
        {patient.medicalHistory.length === 0 ? (
          <div className="mt-3">
            <EmptyState />
          </div>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {patient.medicalHistory.map((item) => (
              <li key={item.title}>
                <span className="font-medium">{item.title}</span>
                <span className="text-muted"> — {item.note}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="pc-card p-5">
        <h2 className="text-sm font-semibold">Visit history</h2>
        {historyQuery.loading ? <LoadingState /> : null}
        {!historyQuery.loading && history.length === 0 ? (
          <div className="mt-3">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {history.map((item) => (
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
        {rxQuery.loading ? <LoadingState /> : null}
        {!rxQuery.loading && rx.length === 0 ? (
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
                    {med.name} {med.dosage} · {med.frequency} · {med.duration}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
      <DocumentsManager lockPatientId={patient._id} />
    </div>
  );
}
