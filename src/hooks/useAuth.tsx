import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, getToken, setToken } from '@/lib/api';
import { AuthUser, BaseCurrency, SessionPayload } from '@/types';
import { setRoleCookie } from '@/lib/roles';

type AuthContextValue = {
  user: AuthUser | null;
  profileId: string | null;
  hospitalId: string | null;
  hospitalName: string | null;
  baseCurrency: BaseCurrency;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionPayload>;
  register: (payload: Record<string, unknown>) => Promise<SessionPayload>;
  registerHospital: (payload: Record<string, unknown>) => Promise<SessionPayload>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await api<{ user: AuthUser; profile: { _id: string } | null }>('/auth/me');
      setUser(me.user);
      setProfileId(me.profile?._id ?? null);
      setRoleCookie(me.user.role);
    } catch {
      setToken(null);
      setUser(null);
      setRoleCookie(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const applySession = (session: SessionPayload) => {
    setToken(session.token);
    setUser(session.user);
    setProfileId(session.profileId);
    setRoleCookie(session.user.role);
    return session;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profileId,
      hospitalId: user?.hospitalId ?? null,
      hospitalName: user?.hospitalName ?? null,
      baseCurrency: user?.baseCurrency ?? 'INR',
      loading,
      login: async (email, password) =>
        applySession(await api<SessionPayload>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })),
      register: async (payload) =>
        applySession(await api<SessionPayload>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        })),
      registerHospital: async (payload) =>
        applySession(await api<SessionPayload>('/auth/register-hospital', {
          method: 'POST',
          body: JSON.stringify(payload),
        })),
      logout: () => {
        setToken(null);
        setUser(null);
        setProfileId(null);
        setRoleCookie(null);
      },
    }),
    [loading, profileId, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
