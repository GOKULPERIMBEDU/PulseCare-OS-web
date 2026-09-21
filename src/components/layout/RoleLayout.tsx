import { Outlet } from 'react-router-dom';
import { Guard } from '@/components/layout/Guard';
import { UserRole } from '@/types';

export function RoleLayout({ roles }: { roles: UserRole[] }) {
  return (
    <Guard roles={roles}>
      <Outlet />
    </Guard>
  );
}
