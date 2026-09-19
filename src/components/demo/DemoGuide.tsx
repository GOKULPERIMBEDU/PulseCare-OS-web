'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  FolderLock,
  LayoutDashboard,
  Radio,
  Receipt,
  Shield,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { DemoAccountKey, DemoAccountsPayload } from '@/types';
import { useApiResource } from '@/hooks/useApiResource';
import { EmptyState, LoadingState } from '@/components/ui/DataState';

const ROLE_ICONS = {
  super: Shield,
  hospital: Building2,
  doctor: Stethoscope,
  patient: UserRound,
} as const;

const ROLE_COPY: Record<DemoAccountKey, { label: string; description: string }> = {
  super: {
    label: 'Login as Super Admin',
    description: 'Platform owner — all hospitals and SaaS billing',
  },
  hospital: {
    label: 'Login as Hospital Admin',
    description: 'Manage hospital operations, doctors, patients, and INR billing',
  },
  doctor: {
    label: 'Login as Doctor',
    description: 'View daily schedule, live queues, and patient EMR',
  },
  patient: {
    label: 'Login as Patient',
    description: 'Access patient portal for booking, records, and invoices',
  },
};

const ROLE_QUERY: Record<DemoAccountKey, string> = {
  super: 'superadmin',
  hospital: 'hospital',
  doctor: 'doctor',
  patient: 'patient',
};

const PLATFORM_KEYS: DemoAccountKey[] = ['super'];
const WORKSPACE_KEYS: DemoAccountKey[] = ['hospital', 'doctor', 'patient'];

const MODULES = [
  { icon: Users, label: 'Patient & Doctor Management' },
  { icon: CalendarCheck, label: 'Smart Appointment Booking & Doctor Availability' },
  { icon: ClipboardList, label: 'Medical Records (EMR) & Digital Prescriptions' },
  { icon: Receipt, label: 'Centralized Billing & Invoicing' },
  { icon: LayoutDashboard, label: 'Comprehensive Admin Dashboard' },
];

const ADVANCED = [
  { icon: Radio, label: 'Real-time Live Queue Updates (Socket.io)' },
  { icon: Shield, label: 'Strict 4-Tier Role-Based Access Control (RBAC)' },
  { icon: CalendarCheck, label: 'Appointment Conflict & Double-Booking Detection' },
  { icon: FileText, label: 'System Audit Logs for Security' },
  { icon: FolderLock, label: 'Secure File / Document Management' },
];

export function DemoGuide() {
  const router = useRouter();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const { data, loading } = useApiResource<DemoAccountsPayload>('/auth/demo-accounts');
  const accounts = (data?.accounts ?? []).filter(
    (account, index, list) => list.findIndex((item) => item.key === account.key) === index,
  );

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function startDemo(key: DemoAccountKey) {
    setOpen(false);
    router.push(`/login?role=${ROLE_QUERY[key]}`);
  }

  function accountsFor(keys: DemoAccountKey[]) {
    return keys
      .map((key) => accounts.find((account) => account.key === key))
      .filter((account): account is (typeof accounts)[number] => Boolean(account));
  }

  function renderRoleButton(account: (typeof accounts)[number]) {
    const Icon = ROLE_ICONS[account.key];
    const copy = ROLE_COPY[account.key];
    return (
      <button
        key={account.key}
        type="button"
        onClick={() => startDemo(account.key)}
        className="rounded-2xl border border-line bg-surface p-3.5 text-left transition hover:border-teal hover:bg-teal-soft/50"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-white dark:bg-teal">
            <Icon className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-5">{copy.label}</span>
            <span className="mt-0.5 block text-xs leading-5 text-muted">{copy.description}</span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(18,52,77,0.28)] transition hover:opacity-95 dark:bg-teal"
      >
        <Sparkles className="h-4 w-4" />
        Quick Demo Guide
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Close demo guide overlay"
            className="absolute inset-0 bg-[#12344d]/50 backdrop-blur-md"
            onClick={close}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[min(94vh,820px)] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-surface/92 shadow-[0_32px_90px_rgba(16,32,51,0.32)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted transition hover:bg-surface-2 hover:text-foreground"
              aria-label="Close demo guide"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-line px-5 py-5 pr-14 sm:px-8 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
                Reviewer walkthrough
              </p>
              <h2 id={titleId} className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome to PulseCare OS - Enterprise Healthcare SaaS
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                A scalable, multi-tenant platform built for real-world hospital workflows — isolated
                tenant data, live operations, and role-specific consoles for every actor in the care
                pathway.
              </p>
            </div>

            <div className="grid md:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6 border-b border-line px-5 py-5 sm:px-8 sm:py-6 md:border-b-0 md:border-r">
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Key modules
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {MODULES.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/70 px-3 py-3"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium leading-5">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Advanced technical features
                  </p>
                  <ul className="mt-3 space-y-2">
                    {ADVANCED.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl px-1 py-1.5"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-teal">
                          <item.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-5">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="flex flex-col bg-surface-2/40 px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal" />
                  <h3 className="text-sm font-semibold">Test the System</h3>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Choose a role to open Sign-In with that demo account pre-filled. Confirm login on
                  the next screen.
                </p>
                <div className="mt-4 space-y-5">
                  {loading ? <LoadingState /> : null}
                  {!loading && accounts.length === 0 ? <EmptyState /> : null}
                  {!loading && accounts.length > 0 ? (
                    <>
                      <section>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                          PulseCare OS Platform
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          Platform owner access to manage onboarded hospitals and SaaS billing.
                        </p>
                        <div className="mt-2.5 grid gap-2.5">
                          {accountsFor(PLATFORM_KEYS).map(renderRoleButton)}
                        </div>
                      </section>
                      <section>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                          Hospital Workspace
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          Isolated tenant access for hospital administration, medical staff, and
                          patients.
                        </p>
                        <div className="mt-2.5 grid gap-2.5">
                          {accountsFor(WORKSPACE_KEYS).map(renderRoleButton)}
                        </div>
                      </section>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
