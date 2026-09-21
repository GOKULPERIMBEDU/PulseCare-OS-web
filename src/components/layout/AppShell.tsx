import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  Receipt,
  Stethoscope,
  Sun,
  Users,
  Shield,
  CalendarDays,
  FolderOpen,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { fullName, initials } from '@/lib/format';
import { roleHomePath, roleLabel } from '@/lib/roles';
import { UserRole } from '@/types';

const NAV: Record<UserRole, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  SUPER_ADMIN: [
    { href: '/super-admin', label: 'Platform', icon: LayoutDashboard },
    { href: '/super-admin/hospitals', label: 'Hospitals', icon: Building2 },
    { href: '/super-admin/billing', label: 'SaaS billing', icon: Receipt },
  ],
  HOSPITAL_ADMIN: [
    { href: '/hospital-admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/hospital-admin/patients', label: 'Patients', icon: Users },
    { href: '/hospital-admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/hospital-admin/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/hospital-admin/billing', label: 'Patient billing', icon: Receipt },
    { href: '/hospital-admin/documents', label: 'Documents', icon: FolderOpen },
    { href: '/hospital-admin/audit', label: 'Audit logs', icon: Shield },
    { href: '/queue', label: 'Queue board', icon: Activity },
  ],
  DOCTOR: [
    { href: '/doctor', label: "Today's board", icon: LayoutDashboard },
    { href: '/doctor/queue', label: 'Live queue', icon: Activity },
    { href: '/doctor/patients', label: 'EMR', icon: ClipboardList },
    { href: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/doctor/documents', label: 'Documents', icon: FolderOpen },
    { href: '/queue', label: 'Clinic board', icon: CalendarDays },
  ],
  PATIENT: [
    { href: '/patient', label: 'Home', icon: LayoutDashboard },
    { href: '/patient/book', label: 'Book visit', icon: CalendarDays },
    { href: '/patient/records', label: 'Medical history', icon: ClipboardList },
    { href: '/patient/billing', label: 'Billing', icon: Receipt },
    { href: '/patient/documents', label: 'Reports', icon: FolderOpen },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!user) return null;
  const links = NAV[user.role];
  const workspace = user.hospitalName ?? 'PulseCare Platform';

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface p-4 lg:flex lg:flex-col">
        <Link to={roleHomePath(user.role)} className="mb-8 px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">PulseCare</p>
          <p className="text-lg font-semibold">OS Clinical</p>
          <p className="mt-1 truncate text-xs text-muted">{workspace}</p>
        </Link>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  active ? 'bg-teal-soft text-teal' : 'text-muted hover:bg-surface-2 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl bg-surface-2 p-3">
          <p className="text-sm font-medium">{fullName(user)}</p>
          <p className="text-xs text-muted">{roleLabel(user.role)} · {user.baseCurrency}</p>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-soft text-xs font-semibold text-teal">
              {initials(user)}
            </div>
            <div className="lg:hidden">
              <p className="text-sm font-semibold">{workspace}</p>
              <p className="text-xs text-muted">{roleLabel(user.role)} portal</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold">{workspace}</p>
              <p className="text-xs text-muted">
                {user.role === 'SUPER_ADMIN' ? 'Platform owner' : `Billing ${user.baseCurrency}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="rounded-xl p-2 text-muted hover:bg-surface-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
