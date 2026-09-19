'use client';

import { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { AuthHomeLink, AuthLogo } from '@/components/auth/AuthBrand';
import { ApiError } from '@/lib/api';
import { roleHomePath } from '@/lib/roles';
import { DemoAccount, DemoAccountsPayload } from '@/types';
import { useApiResource } from '@/hooks/useApiResource';

const TENANT_LOGINS = [
  { label: 'Hospital Admin · admin@pulsecare.os', email: 'admin@pulsecare.os', password: 'PulseCare!admin' },
  { label: 'Doctor · doctor@pulsecare.os', email: 'doctor@pulsecare.os', password: 'PulseCare!doctor' },
  { label: 'Patient · patient@pulsecare.os', email: 'patient@pulsecare.os', password: 'PulseCare!patient' },
];

const ROLE_PREFILL: Record<string, { email: string; password: string }> = {
  superadmin: { email: 'superadmin@pulsecare.os', password: 'PulseCare!super' },
  hospital: { email: 'admin@pulsecare.os', password: 'PulseCare!admin' },
  hospitaladmin: { email: 'admin@pulsecare.os', password: 'PulseCare!admin' },
  doctor: { email: 'doctor@pulsecare.os', password: 'PulseCare!doctor' },
  patient: { email: 'patient@pulsecare.os', password: 'PulseCare!patient' },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted">
      Loading sign-in…
    </div>
  );
}

function LoginForm() {
  const { login, user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: demoPayload } = useApiResource<DemoAccountsPayload>('/auth/demo-accounts');
  const accounts: DemoAccount[] = demoPayload?.accounts ?? [];
  const demo = accounts.find((item) => item.key === searchParams.get('demo'));
  const rolePrefill = ROLE_PREFILL[searchParams.get('role') ?? ''];
  const prefill = demo ?? rolePrefill;
  const autoLoginStarted = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!prefill) return;
    setEmail(prefill.email);
    setPassword(prefill.password);
  }, [prefill]);

  useEffect(() => {
    if (demo || rolePrefill) return;
    if (!loading && user) {
      router.replace(roleHomePath(user.role));
    }
  }, [demo, rolePrefill, loading, router, user]);

  useEffect(() => {
    if (!demo || loading || autoLoginStarted.current) return;
    autoLoginStarted.current = true;
    void (async () => {
      setError('');
      setPending(true);
      try {
        if (user) logout();
        const session = await login(demo.email, demo.password);
        router.replace(roleHomePath(session.user.role));
      } catch (err) {
        autoLoginStarted.current = false;
        setError(err instanceof ApiError ? err.message : 'Unable to sign in');
      } finally {
        setPending(false);
      }
    })();
  }, [demo, loading, login, logout, router, user]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const session = await login(email, password);
      router.push(roleHomePath(session.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-[#12344d] p-10 text-white lg:flex">
        <AuthHomeLink variant="onDark" />
        <div>
          <AuthLogo variant="onDark" prominent />
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Secure access to the clinical operating console.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Role-based portals for administration, physicians, and patients with live queue telemetry.
          </p>
        </div>
        <p className="text-xs text-white/50">HIPAA-aligned access control · Audit-ready</p>
      </section>
      <section className="flex flex-col p-6 lg:items-center lg:justify-center">
        <div className="mb-10 space-y-3 lg:hidden">
          <AuthHomeLink />
          <div>
            <AuthLogo />
          </div>
        </div>
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Sign in</p>
            <h2 className="mt-1 text-2xl font-semibold">Welcome back</h2>
            {demo ? (
              <p className="mt-2 text-sm text-muted">
                Demo account filled for {demo.label.replace('Login as ', '')}. Signing you in…
              </p>
            ) : null}
          </div>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Authenticating…' : 'Enter workspace'}
          </Button>
          <div className="grid gap-2">
            {TENANT_LOGINS.map((item) => (
              <button
                key={item.email}
                type="button"
                className="rounded-xl border border-line px-3 py-2 text-left text-xs text-muted hover:bg-surface-2"
                onClick={() => {
                  setEmail(item.email);
                  setPassword(item.password);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            New patient?{' '}
            <Link href="/register" className="text-teal">
              Create an account
            </Link>
          </p>
          <p className="text-sm text-muted">
            New organization?{' '}
            <Link href="/register-hospital" className="text-teal">
              Register your hospital
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
