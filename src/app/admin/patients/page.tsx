'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { Patient } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { QueryError } from '@/components/ui/DataState';

export default function AdminPatientsPage() {
  const { data, loading, error, reload } = useApiResource<Patient[]>('/patients');
  const patients = data ?? [];
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFormError('');
    try {
      await api('/patients', {
        method: 'POST',
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          email: form.get('email'),
          password: form.get('password'),
          dateOfBirth: form.get('dateOfBirth'),
          gender: form.get('gender'),
          phone: form.get('phone'),
          bloodGroup: form.get('bloodGroup'),
          address: {
            line1: form.get('line1'),
            city: form.get('city'),
            state: form.get('state'),
            postalCode: form.get('postalCode'),
            country: form.get('country'),
          },
          emergencyContacts: [
            {
              name: form.get('emergencyName'),
              relationship: form.get('emergencyRelationship'),
              phone: form.get('emergencyPhone'),
            },
          ],
        }),
      });
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create patient');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Patients"
        description="Master patient index with MRN, contacts, and emergency data."
        actions={<Button onClick={() => setOpen((value) => !value)}>Add patient</Button>}
      />
      {open ? (
        <form onSubmit={onSubmit} className="pc-card mb-6 grid gap-3 p-5 sm:grid-cols-3">
          <Field label="First name"><Input name="firstName" required /></Field>
          <Field label="Last name"><Input name="lastName" required /></Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Password"><Input name="password" type="password" minLength={8} required /></Field>
          <Field label="DOB"><Input name="dateOfBirth" type="date" required /></Field>
          <Field label="Gender">
            <Select name="gender" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Phone"><Input name="phone" required /></Field>
          <Field label="Blood group"><Input name="bloodGroup" /></Field>
          <Field label="Address"><Input name="line1" required /></Field>
          <Field label="City"><Input name="city" required /></Field>
          <Field label="State"><Input name="state" required /></Field>
          <Field label="Postal"><Input name="postalCode" required /></Field>
          <Field label="Country"><Input name="country" defaultValue="IN" required /></Field>
          <Field label="Emergency name"><Input name="emergencyName" required /></Field>
          <Field label="Relationship"><Input name="emergencyRelationship" required /></Field>
          <Field label="Emergency phone"><Input name="emergencyPhone" required /></Field>
          {formError ? <p className="sm:col-span-3 text-sm text-danger">{formError}</p> : null}
          <div className="sm:col-span-3">
            <Button type="submit">Save patient</Button>
          </div>
        </form>
      ) : null}
      {error ? <QueryError message={error} /> : null}
      <Table columns={['MRN', 'Patient', 'Phone', 'DOB', 'Allergies']} loading={loading} empty={!loading && patients.length === 0}>
        {patients.map((patient) => (
          <tr key={patient._id}>
            <td className="px-4 py-3 font-mono text-xs">{patient.mrn}</td>
            <td className="px-4 py-3">{entityName(patient)}</td>
            <td className="px-4 py-3 text-muted">{patient.phone}</td>
            <td className="px-4 py-3 text-muted">{formatDate(patient.dateOfBirth)}</td>
            <td className="px-4 py-3 text-muted">{patient.allergies.join(', ') || 'None'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
