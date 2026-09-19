'use client';

import { Appointment } from '@/types';
import { entityName } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { QueryError } from '@/components/ui/DataState';

function AppointmentsListPage() {
  const { data, loading, error } = useApiResource<Appointment[]>('/appointments');
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Appointments"
        description="Enterprise schedule with status, slot, and clinician assignment."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Date', 'Slot', 'Patient', 'Doctor', 'Reason', 'Status']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3">{item.date}</td>
            <td className="px-4 py-3 font-mono text-xs">
              {item.timeSlot}–{item.endTime}
            </td>
            <td className="px-4 py-3">{entityName(item.patientId)}</td>
            <td className="px-4 py-3">{entityName(item.doctorId)}</td>
            <td className="px-4 py-3 text-muted">{item.reason}</td>
            <td className="px-4 py-3">
              <StatusBadge status={item.status} />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default AppointmentsListPage;
