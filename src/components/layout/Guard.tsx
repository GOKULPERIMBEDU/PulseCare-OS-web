'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { UserRole } from '@/types';
import { roleHomePath } from '@/lib/roles';

export function Guard({
  roles,
  children,
}: {
  roles: UserRole[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace(roleHomePath(user.role));
    }
  }, [loading, roles, router, user]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading clinical workspace…
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
