const AUTH_STORAGE_KEY = 'hwapulgi/auth';
const DEVICE_ID_KEY = 'hwapulgi/deviceId';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://168.107.62.13.nip.io';

export interface AuthToken {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RawTokenResponse {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function toAuthToken(raw: RawTokenResponse): AuthToken {
  return {
    userId: raw.userId,
    nickname: raw.nickname,
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    expiresAt: Date.now() + raw.expiresIn * 1000,
  };
}

export function getStoredAuth(): AuthToken | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthToken;
  } catch {
    return null;
  }
}

export function storeAuth(auth: AuthToken) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, fresh);
  return fresh;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? response.statusText);
  }
  return payload.data as T;
}

export async function guestLogin(): Promise<AuthToken> {
  const deviceId = getDeviceId();
  const raw = await postJson<RawTokenResponse>('/api/auth/guest/login', { deviceId });
  return toAuthToken(raw);
}

export async function refreshAuth(refreshToken: string): Promise<AuthToken> {
  const raw = await postJson<RawTokenResponse>('/api/auth/toss/refresh', { refreshToken });
  return toAuthToken(raw);
}

export async function ensureAuth(): Promise<AuthToken> {
  const existing = getStoredAuth();
  if (existing && Date.now() < existing.expiresAt - 60_000) {
    return existing;
  }
  const fresh = await guestLogin();
  storeAuth(fresh);
  return fresh;
}
