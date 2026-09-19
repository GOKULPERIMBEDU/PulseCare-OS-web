'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { Doctor } from '@/types';
import { entityName } from '@/lib/format';
import { useMoney } from '@/hooks/useMoney';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { QueryError } from '@/components/ui/DataState';

export default function AdminDoctorsPage() {
  const { money } = useMoney();
  const { data, loading, error, reload } = useApiResource<Doctor[]>('/doctors');
  const doctors = data ?? [];
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFormError('');
    try {
      await api('/doctors', {
        method: 'POST',
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          email: form.get('email'),
          password: form.get('password'),
          specialization: form.get('specialization'),
          department: form.get('department'),
          consultationFee: Number(form.get('consultationFee')),
          licenseNumber: form.get('licenseNumber'),
          bio: form.get('bio'),
        }),
      });
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create doctor');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Physicians"
        description="Specialties, departments, fees, and weekday clinic templates."
        actions={<Button onClick={() => setOpen((value) => !value)}>Add physician</Button>}
      />
      {open ? (
        <form onSubmit={onSubmit} className="pc-card mb-6 grid gap-3 p-5 sm:grid-cols-3">
          <Field label="First name"><Input name="firstName" required /></Field>
          <Field label="Last name"><Input name="lastName" required /></Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Password"><Input name="password" type="password" minLength={8} required /></Field>
          <Field label="Specialization"><Input name="specialization" required /></Field>
          <Field label="Department"><Input name="department" required /></Field>
          <Field label="Fee"><Input name="consultationFee" type="number" min={0} required /></Field>
          <Field label="License"><Input name="licenseNumber" required /></Field>
          <Field label="Bio"><Input name="bio" /></Field>
          {formError ? <p className="sm:col-span-3 text-sm text-danger">{formError}</p> : null}
          <div className="sm:col-span-3"><Button type="submit">Save physician</Button></div>
        </form>
      ) : null}
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Physician', 'Department', 'Specialty', 'Fee', 'License']} loading={loading} empty={!loading && doctors.length === 0}>
        {doctors.map((doctor) => (
          <tr key={doctor._id}>
            <td className="px-4 py-3">{entityName(doctor)}</td>
            <td className="px-4 py-3 text-muted">{doctor.department}</td>
            <td className="px-4 py-3">{doctor.specialization}</td>
            <td className="px-4 py-3">{money(doctor.consultationFee)}</td>
            <td className="px-4 py-3 font-mono text-xs">{doctor.licenseNumber}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
