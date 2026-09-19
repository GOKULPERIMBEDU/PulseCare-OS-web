'use client';

import { Guard } from '@/components/layout/Guard';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <Guard roles={['SUPER_ADMIN']}>{children}</Guard>;
}
