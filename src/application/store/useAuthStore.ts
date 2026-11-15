import { create } from 'zustand';
import { authApi } from '../../infrastructure/api/services';
import { parseApiError, setSessionExpiredHandler, tokenStore } from '../../infrastructure/http/axiosClient';
import type { AuthUser } from '../../domain/models/api';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  loading: boolean;

  /** Al arrancar: la cookie httpOnly de refresh restaura la sesión. */
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  setSessionExpiredHandler(() => {
    tokenStore.set(null);
    set({ status: 'anonymous', user: null, error: 'Tu sesión expiró. Inicia sesión de nuevo.' });
  });

  return {
    status: 'checking',
    user: null,
    error: null,
    loading: false,

    bootstrap: async () => {
      try {
        const { accessToken } = await authApi.refresh();
        tokenStore.set(accessToken);
        const user = await authApi.me();
        if (user.role !== 'admin') throw new Error('not-admin');
        set({ status: 'authenticated', user });
      } catch {
        tokenStore.set(null);
        set({ status: 'anonymous', user: null });
      }
    },

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const res = await authApi.login(email, password);
        if (res.user.role !== 'admin') {
          await authApi.logout().catch(() => undefined);
          set({ loading: false, error: 'Esta cuenta no tiene acceso al panel de administración.' });
          return false;
        }
        tokenStore.set(res.accessToken);
        set({ status: 'authenticated', user: res.user, loading: false });
        return true;
      } catch (e) {
        const err = parseApiError(e);
        const message =
          err.status === 429
            ? 'Demasiados intentos. Espera un minuto.'
            : err.code === 'AUTH_INVALID_CREDENTIALS'
              ? 'Email o contraseña incorrectos.'
              : err.message;
        set({ loading: false, error: message });
        return false;
      }
    },

    logout: async () => {
      await authApi.logout().catch(() => undefined);
      tokenStore.set(null);
      set({ status: 'anonymous', user: null, error: null });
    },
  };
});
