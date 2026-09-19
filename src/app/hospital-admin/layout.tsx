'use client';

import { Guard } from '@/components/layout/Guard';

export default function HospitalAdminLayout({ children }: { children: React.ReactNode }) {
  return <Guard roles={['HOSPITAL_ADMIN']}>{children}</Guard>;
}
