'use client';

import Link from 'next/link';
import { Patient } from '@/types';
import { entityName, formatDate } from '@/lib/format';
import { useApiResource } from '@/hooks/useApiResource';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { QueryError } from '@/components/ui/DataState';

export default function DoctorPatientsPage() {
  const { data, loading, error } = useApiResource<Patient[]>('/patients');
  const patients = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="EMR"
        title="Patient charts"
        description="Open a record for history, allergies, prescriptions, and files."
      />
      {error ? <QueryError message={error} /> : null}
      <Table columns={['MRN', 'Patient', 'DOB', 'Allergies', '']} loading={loading} empty={!loading && patients.length === 0}>
        {patients.map((patient) => (
          <tr key={patient._id}>
            <td className="px-4 py-3 font-mono text-xs">{patient.mrn}</td>
            <td className="px-4 py-3">{entityName(patient)}</td>
            <td className="px-4 py-3 text-muted">{formatDate(patient.dateOfBirth)}</td>
            <td className="px-4 py-3 text-muted">{patient.allergies.join(', ') || 'None listed'}</td>
            <td className="px-4 py-3">
              <Link className="text-sm text-teal" href={`/doctor/patients/${patient._id}`}>
                Open chart
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
