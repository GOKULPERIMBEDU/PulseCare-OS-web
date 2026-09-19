import Link from 'next/link';
import { Activity, Shield, Stethoscope, CalendarCheck } from 'lucide-react';
import { DemoGuide } from '@/components/demo/DemoGuide';

export default function LandingPage() {
  return (
    <div className="pc-grid-bg min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">PulseCare OS</p>
            <p className="text-sm text-muted">Hospital operating system</p>
          </div>
          <Link
            href="/login?role=superadmin"
            className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/15 hover:text-foreground"
          >
            Platform Admin Console
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/register-hospital"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Register hospital
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-teal">Clinical operations · Revenue · Safety</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            One system for appointments, live queues, records, and billing.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted">
            PulseCare OS is a multi-tenant hospital operating system. Each registered hospital gets
            an isolated workspace for appointments, live queues, records, and billing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register-hospital" className="rounded-xl bg-teal px-5 py-3 text-sm font-medium text-white">
              Register your hospital
            </Link>
            <Link href="/login" className="rounded-xl border border-line bg-surface px-5 py-3 text-sm">
              Open console
            </Link>
            <Link href="/register" className="rounded-xl border border-line bg-surface px-5 py-3 text-sm">
              Register as patient
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: CalendarCheck, title: 'Smart booking', body: 'Live slot availability with double-booking prevention.' },
            { icon: Activity, title: 'Live queue', body: 'Waiting, in-consultation, and completed — streamed instantly.' },
            { icon: Stethoscope, title: 'Physician EMR', body: 'History, prescriptions, and documents in one clinical view.' },
            { icon: Shield, title: 'Tenant isolation', body: 'Each hospital’s data, billing currency, and live queue stay private.' },
          ].map((item) => (
            <article key={item.title} className="pc-card p-5">
              <item.icon className="h-5 w-5 text-teal" />
              <h2 className="mt-3 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </main>
      <DemoGuide />
    </div>
  );
}
