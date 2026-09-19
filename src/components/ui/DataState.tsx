import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
      <Loader2 className="h-4 w-4 animate-spin text-teal" />
      {label}
    </div>
  );
}

export function EmptyState({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
      {message}
    </div>
  );
}

export function QueryError({ message }: { message: string }) {
  return <p className="mb-4 text-sm text-danger">{message}</p>;
}
