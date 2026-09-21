import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!roles.includes(user.role)) {
      navigate(roleHomePath(user.role), { replace: true });
    }
  }, [loading, roles, navigate, user]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading clinical workspace…
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
