import { UserRole } from '@/types';

export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: '/super-admin',
  HOSPITAL_ADMIN: '/hospital-admin',
  DOCTOR: '/doctor',
  PATIENT: '/patient',
};

export function roleHomePath(role: UserRole): string {
  return ROLE_HOME[role] ?? '/login';
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'HOSPITAL_ADMIN':
      return 'Hospital Admin';
    case 'DOCTOR':
      return 'Doctor';
    case 'PATIENT':
      return 'Patient';
  }
}

export function setRoleCookie(role: UserRole | null): void {
  if (typeof document === 'undefined') return;
  if (role) {
    document.cookie = `pulsecare.role=${role}; path=/; SameSite=Lax`;
    return;
  }
  document.cookie = 'pulsecare.role=; path=/; max-age=0';
}
