import { api } from '@/lib/api';
import { AppointmentStatus } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useQueueSocket } from '@/hooks/useQueueSocket';
import { QueueBoard } from '@/components/queue/QueueBoard';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ClinicQueuePage() {
  const { hospitalName } = useAuth();
  const { queue, connected, date, loading } = useQueueSocket();

  async function onStatus(id: string, status: AppointmentStatus) {
    await api(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow={hospitalName ?? 'Hospital board'}
        title="Live patient queue"
        description={`Real-time tracking for ${date || 'today'} in ${hospitalName ?? 'this hospital'} — waiting, consultation, and completed.`}
      />
      <QueueBoard items={queue} connected={connected} loading={loading} onStatus={onStatus} />
    </div>
  );
}
