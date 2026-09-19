'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { AuthHomeLink, AuthLogo } from '@/components/auth/AuthBrand';
import { ApiError } from '@/lib/api';
import { HospitalDirectoryItem } from '@/types';
import { useApiResource } from '@/hooks/useApiResource';
import { EmptyState, LoadingState } from '@/components/ui/DataState';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const { data, loading, error: hospitalsError } = useApiResource<HospitalDirectoryItem[]>('/auth/hospitals');
  const hospitals = data ?? [];
  const [hospitalId, setHospitalId] = useState('');

  useEffect(() => {
    if (!hospitalId && hospitals[0]) setHospitalId(hospitals[0]._id);
  }, [hospitalId, hospitals]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      await register({
        hospitalId,
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        password: form.get('password'),
        dateOfBirth: form.get('dateOfBirth'),
        gender: form.get('gender'),
        phone: form.get('phone'),
        address: {
          line1: form.get('line1'),
          city: form.get('city'),
          state: form.get('state'),
          postalCode: form.get('postalCode'),
          country: form.get('country') || 'IN',
        },
        emergencyContacts: [
          {
            name: form.get('emergencyName'),
            relationship: form.get('emergencyRelationship'),
            phone: form.get('emergencyPhone'),
          },
        ],
      });
      router.push('/patient');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to register');
    } finally {
      setPending(false);
    }
  }

  const selected = hospitals.find((item) => item._id === hospitalId);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <AuthHomeLink />
      <div className="mt-6">
        <AuthLogo />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Patient intake</p>
      <h1 className="mt-2 text-3xl font-semibold">Create your PulseCare record</h1>
      <p className="mt-2 text-sm text-muted">
        Choose the hospital you receive care from. Your chart stays isolated to that organization.
      </p>
      <form onSubmit={onSubmit} className="pc-card mt-8 grid gap-4 p-6 sm:grid-cols-2">
        {loading ? <div className="sm:col-span-2"><LoadingState label="Loading hospitals…" /></div> : null}
        {!loading && hospitals.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState message="No data available" />
          </div>
        ) : null}
        <Field label="Hospital">
          <Select
            value={hospitalId}
            onChange={(event) => setHospitalId(event.target.value)}
            required
            disabled={hospitals.length === 0}
          >
            {hospitals.length === 0 ? <option value="">No hospitals available</option> : null}
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name} · {hospital.region} ({hospital.baseCurrency})
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex items-end text-sm text-muted">
          {selected
            ? `Billing currency ${selected.baseCurrency}`
            : 'A hospital must be registered before patients can join.'}
        </div>
        <Field label="First name"><Input name="firstName" required /></Field>
        <Field label="Last name"><Input name="lastName" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Password"><Input name="password" type="password" minLength={8} required /></Field>
        <Field label="Date of birth"><Input name="dateOfBirth" type="date" required /></Field>
        <Field label="Gender">
          <Select name="gender" defaultValue="female">
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="undisclosed">Prefer not to say</option>
          </Select>
        </Field>
        <Field label="Phone"><Input name="phone" required /></Field>
        <Field label="Address"><Input name="line1" required /></Field>
        <Field label="City"><Input name="city" required /></Field>
        <Field label="State"><Input name="state" required /></Field>
        <Field label="Postal code"><Input name="postalCode" required /></Field>
        <Field label="Country"><Input name="country" defaultValue="IN" required /></Field>
        <div className="sm:col-span-2 mt-2 text-sm font-medium">Emergency contact</div>
        <Field label="Name"><Input name="emergencyName" required /></Field>
        <Field label="Relationship"><Input name="emergencyRelationship" required /></Field>
        <Field label="Phone"><Input name="emergencyPhone" required /></Field>
        {error || hospitalsError ? (
          <p className="sm:col-span-2 text-sm text-danger">{error || hospitalsError}</p>
        ) : null}
        <div className="sm:col-span-2 flex items-center justify-between">
          <Link href="/login" className="text-sm text-muted">Back to sign in</Link>
          <Button type="submit" disabled={pending || !hospitalId}>
            {pending ? 'Creating…' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );
}
