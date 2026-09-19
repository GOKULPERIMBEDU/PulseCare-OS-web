import { AppointmentStatus, PaymentStatus } from '@/types';

const appointment: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-surface-2 text-muted',
  Waiting: 'bg-warn-soft text-warn',
  'In-Consultation': 'bg-teal-soft text-teal',
  Completed: 'bg-ok-soft text-ok',
  Cancelled: 'bg-danger-soft text-danger',
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${appointment[status]}`}>
      {status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        status === 'Paid' ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'
      }`}
    >
      {status}
    </span>
  );
}
