import { AuthUser, BaseCurrency, Doctor, Patient } from '@/types';

export function fullName(person?: { firstName?: string; lastName?: string } | null): string {
  if (!person?.firstName) return 'Unknown';
  return `${person.firstName} ${person.lastName ?? ''}`.trim();
}

export function entityName(entity: Patient | Doctor | string | undefined | null): string {
  if (!entity || typeof entity === 'string') return '—';
  const user = entity.userId;
  if (!user || typeof user === 'string') return '—';
  return fullName(user);
}

export function money(value: number, currency: BaseCurrency = 'INR'): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatDate(value?: string): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function initials(user: AuthUser | { firstName: string; lastName: string }): string {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
}
