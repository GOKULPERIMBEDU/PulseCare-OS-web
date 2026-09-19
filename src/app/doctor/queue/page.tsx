'use client';

import { api } from '@/lib/api';
import { AppointmentStatus } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useQueueSocket } from '@/hooks/useQueueSocket';
import { QueueBoard } from '@/components/queue/QueueBoard';
import { PageHeader } from '@/components/ui/PageHeader';

export default function DoctorQueuePage() {
  const { hospitalName } = useAuth();
  const { queue, connected, loading } = useQueueSocket();

  async function onStatus(id: string, status: AppointmentStatus) {
    await api(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Live operations"
        title="Clinic queue"
        description={`Advance patients from waiting to in-consultation to completed at ${hospitalName ?? 'this hospital'}. Updates stream only to this tenant’s boards.`}
      />
      <QueueBoard items={queue} connected={connected} loading={loading} onStatus={onStatus} />
    </div>
  );
}
