import { ApiSuccess } from '@/types';

function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim().replace(/\/$/, '') : '';
}

const apiOrigin = readEnv('VITE_API_BASE_URL');
const socketOrigin = readEnv('VITE_SOCKET_URL') || apiOrigin;

export const API_BASE_URL = apiOrigin.endsWith('/api') ? apiOrigin : `${apiOrigin}/api`;
export const SOCKET_URL = socketOrigin.replace(/\/api\/?$/, '');

const TOKEN_KEY = 'pulsecare.token';

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { message?: string; statusCode?: number };
    return new ApiError(body.message ?? 'Request failed', body.statusCode ?? response.status);
  } catch {
    return new ApiError('Request failed', response.status);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    throw await parseError(response);
  }
  const payload = (await response.json()) as ApiSuccess<T>;
  return payload.data;
}

export async function downloadFile(path: string, filename: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
