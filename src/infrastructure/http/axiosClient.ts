import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Cliente HTTP del panel admin.
 * - accessToken SOLO en memoria (M-A26: nunca localStorage).
 * - refresh_token viaja en cookie httpOnly -> withCredentials.
 * - 401 -> un intento de POST /auth/refresh y reintento de la request original.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.togo-ve.com';

let accessToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler;
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Una sola llamada de refresh en vuelo (el refresh token rota y se consume una vez).
let refreshing: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshing) {
    refreshing = axios
      .post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        accessToken = res.data.accessToken;
        return accessToken;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthCall = original?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return axiosClient(original);
      } catch {
        accessToken = null;
        onSessionExpired?.();
      }
    }
    return Promise.reject(error);
  },
);

export interface ApiErrorInfo {
  status: number | null;
  code: string | null;
  message: string;
}

/** Normaliza los dos shapes de error de la API (dominio con `code`, validación con `message[]`). */
export const parseApiError = (error: unknown): ApiErrorInfo => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { code?: string; message?: string | string[] } | undefined;
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw.join(', ') : raw || error.message;
    return { status: error.response?.status ?? null, code: data?.code ?? null, message };
  }
  return { status: null, code: null, message: error instanceof Error ? error.message : 'Error desconocido' };
};
