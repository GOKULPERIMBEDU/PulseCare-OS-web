import { FormEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Appointment, MedicationItem } from '@/types';
import { entityName } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

const emptyMed = (): MedicationItem => ({
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
});

export default function PrescribePage() {
  const params = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { data: appointment, loading, error } = useApiResource<Appointment>(
    params.appointmentId ? `/appointments/${params.appointmentId}` : null,
  );
  const [meds, setMeds] = useState<MedicationItem[]>([emptyMed()]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    try {
      await api('/prescriptions', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: params.appointmentId,
          medications: meds.filter((item) => item.name && item.dosage),
          notes,
        }),
      });
      navigate('/doctor/prescriptions');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to issue prescription');
    }
  }

  if (loading) return <LoadingState label="Loading visit…" />;
  if (error) return <QueryError message={error} />;
  if (!appointment) return <EmptyState />;

  return (
    <div>
      <PageHeader
        eyebrow="eRx"
        title="Prescription writer"
        description={`${entityName(appointment.patientId)} · ${appointment.date} ${appointment.timeSlot}`}
      />
      <form onSubmit={onSubmit} className="space-y-4">
        {meds.map((med, index) => (
          <div key={index} className="pc-card grid gap-3 p-4 sm:grid-cols-5">
            <Field label="Medication">
              <Input
                value={med.name}
                onChange={(e) =>
                  setMeds((rows) => rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)))
                }
                required
              />
            </Field>
            <Field label="Dosage">
              <Input
                value={med.dosage}
                onChange={(e) =>
                  setMeds((rows) => rows.map((row, i) => (i === index ? { ...row, dosage: e.target.value } : row)))
                }
                required
              />
            </Field>
            <Field label="Frequency">
              <Input
                value={med.frequency}
                onChange={(e) =>
                  setMeds((rows) => rows.map((row, i) => (i === index ? { ...row, frequency: e.target.value } : row)))
                }
                required
              />
            </Field>
            <Field label="Duration">
              <Input
                value={med.duration}
                onChange={(e) =>
                  setMeds((rows) => rows.map((row, i) => (i === index ? { ...row, duration: e.target.value } : row)))
                }
                required
              />
            </Field>
            <Field label="Instructions">
              <Input
                value={med.instructions}
                onChange={(e) =>
                  setMeds((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, instructions: e.target.value } : row)),
                  )
                }
              />
            </Field>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => setMeds((rows) => [...rows, emptyMed()])}>
          Add medication
        </Button>
        <Field label="Clinical notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        {formError ? <p className="text-sm text-danger">{formError}</p> : null}
        <Button type="submit">Issue prescription</Button>
      </form>
    </div>
  );
}
