import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { AuthHomeLink, AuthLogo } from '@/components/auth/AuthBrand';
import { ApiError } from '@/lib/api';
import { BaseCurrency } from '@/types';
import { roleHomePath } from '@/lib/roles';

export default function RegisterHospitalPage() {
  const { registerHospital } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [currency, setCurrency] = useState<BaseCurrency>('INR');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      const adminEmail = String(form.get('adminEmail') ?? '');
      const session = await registerHospital({
        name: form.get('name'),
        region: form.get('region'),
        baseCurrency: currency,
        address: {
          line1: form.get('line1'),
          city: form.get('city'),
          state: form.get('state'),
          postalCode: form.get('postalCode'),
          country: form.get('country') || (currency === 'INR' ? 'IN' : 'US'),
        },
        adminContact: {
          name: form.get('contactName'),
          email: form.get('contactEmail') || adminEmail,
          phone: form.get('contactPhone'),
        },
        admin: {
          firstName: form.get('adminFirstName'),
          lastName: form.get('adminLastName'),
          email: adminEmail,
          password: form.get('adminPassword'),
        },
      });
      navigate(roleHomePath(session.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to register hospital');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <AuthHomeLink />
      <div className="mt-6">
        <AuthLogo />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">SaaS onboarding</p>
      <h1 className="mt-2 text-3xl font-semibold">Register your hospital</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Create an isolated PulseCare workspace for your organization. Your Super Admin account is
        provisioned automatically and all clinical data stays scoped to this hospital.
      </p>
      <form onSubmit={onSubmit} className="pc-card mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2 text-sm font-medium">Hospital</div>
        <Field label="Hospital name">
          <Input name="name" placeholder="City General Hospital" required />
        </Field>
        <Field label="Region">
          <Input name="region" placeholder="Mumbai Metropolitan Region" required />
        </Field>
        <Field label="Default currency">
          <Select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as BaseCurrency)}
          >
            <option value="INR">INR — Indian Rupee</option>
            <option value="USD">USD — US Dollar</option>
          </Select>
        </Field>
        <Field label="Country">
          <Input name="country" defaultValue="IN" required />
        </Field>
        <Field label="Address">
          <Input name="line1" required />
        </Field>
        <Field label="City">
          <Input name="city" required />
        </Field>
        <Field label="State">
          <Input name="state" required />
        </Field>
        <Field label="Postal code">
          <Input name="postalCode" required />
        </Field>

        <div className="sm:col-span-2 mt-2 text-sm font-medium">Admin contact</div>
        <Field label="Contact name">
          <Input name="contactName" required />
        </Field>
        <Field label="Contact phone">
          <Input name="contactPhone" required />
        </Field>
        <Field label="Contact email">
          <Input name="contactEmail" type="email" placeholder="Optional — defaults to Super Admin" />
        </Field>

        <div className="sm:col-span-2 mt-2 text-sm font-medium">Super Admin account</div>
        <Field label="First name">
          <Input name="adminFirstName" required />
        </Field>
        <Field label="Last name">
          <Input name="adminLastName" required />
        </Field>
        <Field label="Admin email">
          <Input name="adminEmail" type="email" required />
        </Field>
        <Field label="Password">
          <Input name="adminPassword" type="password" minLength={8} required />
        </Field>

        {error ? <p className="sm:col-span-2 text-sm text-danger">{error}</p> : null}
        <div className="sm:col-span-2 flex items-center justify-between">
          <Link to="/login" className="text-sm text-muted">
            Already have an account
          </Link>
          <Button type="submit" disabled={pending}>
            {pending ? 'Provisioning…' : 'Create hospital workspace'}
          </Button>
        </div>
      </form>
    </div>
  );
}
