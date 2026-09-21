import { AuditLog } from '@/types';
import { fullName, formatDate } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { QueryError } from '@/components/ui/DataState';

function AuditLogsPage() {
  const { data, loading, error } = useApiResource<AuditLog[]>('/analytics/audit-logs');
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Security"
        title="Audit logs"
        description="Immutable trail of logins, clinical writes, billing, and document events."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['When', 'Actor', 'Role', 'Action', 'Resource', 'IP']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3 text-muted">{formatDate(item.createdAt)}</td>
            <td className="px-4 py-3">
              {typeof item.userId === 'object' ? fullName(item.userId) : 'System'}
            </td>
            <td className="px-4 py-3 capitalize">{item.role ?? '—'}</td>
            <td className="px-4 py-3 font-mono text-xs">{item.actionType}</td>
            <td className="px-4 py-3">{item.resource}</td>
            <td className="px-4 py-3 text-muted">{item.ipAddress ?? '—'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default AuditLogsPage;
