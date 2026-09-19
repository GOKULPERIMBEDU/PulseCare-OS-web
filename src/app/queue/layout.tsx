'use client';

import { Guard } from '@/components/layout/Guard';

export default function QueueLayout({ children }: { children: React.ReactNode }) {
  return <Guard roles={['HOSPITAL_ADMIN', 'DOCTOR']}>{children}</Guard>;
}
