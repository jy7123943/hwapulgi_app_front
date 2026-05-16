// TODO: Client ID 발급 후 appLogin import 경로 확인
// import { appLogin } from '@apps-in-toss/web-framework';

const AUTH_STORAGE_KEY = 'hwapulgi/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface AuthToken {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp
}

export function getStoredAuth(): AuthToken | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const auth = JSON.parse(raw) as AuthToken;
    return auth;
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

export function isTokenExpired(auth: AuthToken): boolean {
  // 만료 1분 전에 갱신
  return Date.now() >= auth.expiresAt - 60_000;
}

export async function tossLogin(): Promise<AuthToken> {
  // TODO: Client ID 발급 후 아래 주석 해제
  // const { authorizationCode, referrer } = await appLogin();

  // 임시: 실제 appLogin() 결과로 대체 필요
  throw new Error('토스 로그인은 Client ID 발급 후 사용 가능합니다.');

  // const response = await fetch(`${API_BASE_URL}/api/auth/toss/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ authorizationCode, referrer }),
  // });
  //
  // if (!response.ok) {
  //   throw new Error('로그인 실패');
  // }
  //
  // const { data } = await response.json();
  // const auth: AuthToken = {
  //   userId: data.userId,
  //   nickname: data.nickname,
  //   accessToken: data.accessToken,
  //   refreshToken: data.refreshToken,
  //   expiresAt: Date.now() + data.expiresIn * 1000,
  // };
  //
  // storeAuth(auth);
  // return auth;
}

export async function refreshAuth(refreshToken: string): Promise<AuthToken> {
  const response = await fetch(`${API_BASE_URL}/api/auth/toss/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuth();
    throw new Error('토큰 갱신 실패');
  }

  const { data } = await response.json();
  const auth: AuthToken = {
    userId: data.userId,
    nickname: data.nickname,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + data.expiresIn * 1000,
  };

  storeAuth(auth);
  return auth;
}

export async function getValidToken(): Promise<string | null> {
  const auth = getStoredAuth();
  if (!auth) return null;

  if (!isTokenExpired(auth)) {
    return auth.accessToken;
  }

  try {
    const refreshed = await refreshAuth(auth.refreshToken);
    return refreshed.accessToken;
  } catch {
    return null;
  }
}

export async function unlinkToss(): Promise<void> {
  const token = await getValidToken();
  if (!token) return;

  await fetch(`${API_BASE_URL}/api/auth/toss/unlink`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  clearAuth();
}
