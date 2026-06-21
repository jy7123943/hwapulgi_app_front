import { appLogin } from '@apps-in-toss/web-framework';

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

/**
 * 토스 인증으로 로그인한다. 토스 SDK의 appLogin()으로 받은 인가코드/referrer를
 * 백엔드에 넘겨 자체 JWT를 발급받는다. (토스 인앱 웹뷰에서만 동작)
 */
export async function tossLogin(): Promise<AuthToken> {
  const { authorizationCode, referrer } = await appLogin();
  const raw = await postJson<RawTokenResponse>('/api/auth/toss/login', {
    authorizationCode,
    referrer,
  });
  return toAuthToken(raw);
}

/**
 * 토스 로그인을 우선 시도하고, 토스 환경이 아니거나(브라우저 개발 등) 실패하면
 * 게스트 로그인으로 폴백한다. 로그인 화면 없이 백그라운드에서 인증을 보장한다.
 */
export async function login(): Promise<AuthToken> {
  try {
    return await tossLogin();
  } catch (err) {
    console.warn('[auth] 토스 로그인 실패/미지원 — 게스트로 폴백합니다.', err);
    return await guestLogin();
  }
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
  const fresh = await login();
  storeAuth(fresh);
  return fresh;
}
