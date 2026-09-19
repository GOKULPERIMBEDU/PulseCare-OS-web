'use client';

import Link from 'next/link';
import { Appointment } from '@/types';
import { entityName, todayISO } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { QueryError } from '@/components/ui/DataState';

export default function DoctorHomePage() {
  const { data, loading, error } = useApiResource<Appointment[]>(`/appointments?date=${todayISO()}`);
  const items = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Physician portal"
        title="Today’s clinic"
        description="Schedule, live status, and one-click access to EMR and prescriptions."
        actions={
          <Link href="/doctor/queue">
            <Button>Open live queue</Button>
          </Link>
        }
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['Time', 'Patient', 'Reason', 'Status', '']} loading={loading} empty={!loading && items.length === 0}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="px-4 py-3 font-mono text-xs">
              {item.timeSlot}–{item.endTime}
            </td>
            <td className="px-4 py-3">{entityName(item.patientId)}</td>
            <td className="px-4 py-3 text-muted">{item.reason}</td>
            <td className="px-4 py-3">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {typeof item.patientId !== 'string' ? (
                  <Link className="text-sm text-teal" href={`/doctor/patients/${item.patientId._id}`}>
                    EMR
                  </Link>
                ) : null}
                <Link className="text-sm text-teal" href={`/doctor/prescribe/${item._id}`}>
                  Prescribe
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
