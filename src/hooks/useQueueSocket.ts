import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken, SOCKET_URL } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Appointment } from '@/types';

type QueuePayload = {
  hospitalId?: string;
  date: string;
  queue: Appointment[];
};

export function useQueueSocket() {
  const { hospitalId } = useAuth();
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [date, setDate] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token || !hospitalId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const socket: Socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    const apply = (payload: QueuePayload) => {
      if (payload.hospitalId && payload.hospitalId !== hospitalId) return;
      setDate(payload.date);
      setQueue(payload.queue ?? []);
      setLoading(false);
    };
    socket.on('queue:snapshot', apply);
    socket.on('queue:updated', apply);

    return () => {
      socket.disconnect();
      setConnected(false);
      setQueue([]);
      setLoading(true);
    };
  }, [hospitalId]);

  return { queue, date, connected, hospitalId, loading };
}
