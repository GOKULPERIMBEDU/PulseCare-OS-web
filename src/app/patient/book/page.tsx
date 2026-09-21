import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { AvailabilityResponse, Doctor } from '@/types';
import { entityName, todayISO } from '@/lib/format';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { EmptyState, LoadingState, QueryError } from '@/components/ui/DataState';

export default function BookPage() {
  const navigate = useNavigate();
  const { money } = useMoney();
  const { data, loading, error: doctorsError } = useApiResource<Doctor[]>('/doctors');
  const doctors = data ?? [];
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId && doctors[0]) setDoctorId(doctors[0]._id);
  }, [doctorId, doctors]);

  useEffect(() => {
    if (!doctorId || !date) return;
    setAvailabilityLoading(true);
    setAvailability(null);
    void api<AvailabilityResponse>(`/doctors/${doctorId}/availability?date=${date}`)
      .then((payload) => {
        setAvailability(payload);
        setTimeSlot('');
        setError('');
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setAvailabilityLoading(false));
  }, [doctorId, date]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await api('/appointments', {
        method: 'POST',
        body: JSON.stringify({ doctorId, date, timeSlot, reason }),
      });
      navigate('/patient');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to book this slot');
    }
  }

  const selected = doctors.find((item) => item._id === doctorId);
  const openSlots = availability?.slots ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Scheduling"
        title="Book a visit"
        description="Live physician availability. Conflicting slots are blocked by the server."
      />
      {doctorsError ? <QueryError message={doctorsError} /> : null}
      {loading ? <LoadingState label="Loading physicians…" /> : null}
      {!loading && doctors.length === 0 ? <EmptyState /> : null}
      {!loading && doctors.length > 0 ? (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="pc-card space-y-4 p-5">
            <Field label="Physician">
              <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {entityName(doctor)} · {doctor.specialization}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label="Reason for visit">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </Field>
            {selected ? (
              <p className="text-sm text-muted">Consultation fee {money(selected.consultationFee)}</p>
            ) : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={!timeSlot} className="w-full">
              Confirm {timeSlot || 'slot'}
            </Button>
          </div>
          <div className="pc-card p-5">
            <h2 className="text-sm font-semibold">Open slots</h2>
            {availabilityLoading ? <LoadingState label="Loading slots…" /> : null}
            {!availabilityLoading && openSlots.length === 0 ? (
              <div className="mt-4">
                <EmptyState />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {openSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setTimeSlot(slot.time)}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      timeSlot === slot.time
                        ? 'border-teal bg-teal-soft text-teal'
                        : slot.available
                          ? 'border-line hover:border-teal'
                          : 'cursor-not-allowed border-line text-muted opacity-40'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      ) : null}
    </div>
  );
}
