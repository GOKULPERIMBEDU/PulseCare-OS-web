'use client';

import { Guard } from '@/components/layout/Guard';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <Guard roles={['DOCTOR']}>{children}</Guard>;
}
