import { clearAuth, getStoredAuth, guestLogin, refreshAuth, storeAuth } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://168.107.62.13.nip.io';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

async function rawFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (!init.skipAuth) {
    const auth = getStoredAuth();
    if (auth) {
      headers.set('Authorization', `Bearer ${auth.accessToken}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const code = payload?.error?.code ?? 'UNKNOWN';
    const message = payload?.error?.message ?? response.statusText;
    throw new ApiError(response.status, code, message);
  }
  return payload.data;
}

let refreshInFlight: Promise<void> | null = null;

async function ensureValidToken(): Promise<void> {
  if (refreshInFlight) {
    await refreshInFlight;
    return;
  }
  refreshInFlight = (async () => {
    const auth = getStoredAuth();
    if (!auth) {
      const fresh = await guestLogin();
      storeAuth(fresh);
      return;
    }
    try {
      const refreshed = await refreshAuth(auth.refreshToken);
      storeAuth(refreshed);
    } catch {
      clearAuth();
      const fresh = await guestLogin();
      storeAuth(fresh);
    }
  })();
  try {
    await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  try {
    return await rawFetch<T>(path, init);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && !init.skipAuth) {
      await ensureValidToken();
      return await rawFetch<T>(path, init);
    }
    throw err;
  }
}