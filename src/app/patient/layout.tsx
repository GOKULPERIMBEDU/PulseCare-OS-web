'use client';

import { Guard } from '@/components/layout/Guard';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <Guard roles={['PATIENT']}>{children}</Guard>;
}
