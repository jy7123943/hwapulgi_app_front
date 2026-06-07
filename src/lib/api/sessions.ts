import type { SessionInput, SessionResult } from '../../types';
import { apiFetch } from './client';

interface BackendSessionResponse {
  id: string;
  target: string;
  customTarget: string | null;
  targetNickname: string;
  angerBefore: number;
  angerAfter: number;
  hits: number;
  skillShots: number;
  releasedPercent: number;
  points: number;
  memo: string | null;
  createdAt: string;
}

interface BackendPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

function toSessionResult(s: BackendSessionResponse): SessionResult {
  return {
    id: s.id,
    target: s.target as SessionResult['target'],
    customTarget: s.customTarget ?? '',
    nickname: s.targetNickname,
    gender: 'boy',
    angerBefore: s.angerBefore,
    angerAfter: s.angerAfter,
    hits: s.hits,
    skillShots: s.skillShots,
    releasedPercent: s.releasedPercent,
    points: s.points,
    memo: s.memo ?? '',
    createdAt: s.createdAt,
  };
}

export async function listSessions(): Promise<SessionResult[]> {
  const page = await apiFetch<BackendPage<BackendSessionResponse>>(
    '/api/v1/sessions?size=100',
  );
  return page.content.map(toSessionResult);
}

export interface CreateSessionInput {
  draft: SessionInput;
  hits: number;
  skillShots: number;
  angerAfter: number;
  releasedPercent: number;
  points: number;
}

export async function createSession(input: CreateSessionInput): Promise<SessionResult> {
  const body = {
    target: input.draft.target || '기타',
    customTarget: input.draft.customTarget?.trim() || null,
    targetNickname: input.draft.nickname.trim(),
    angerBefore: input.draft.angerBefore,
    angerAfter: input.angerAfter,
    hits: input.hits,
    skillShots: input.skillShots,
    releasedPercent: input.releasedPercent,
    points: input.points,
    memo: input.draft.memo?.trim() || null,
  };
  const res = await apiFetch<BackendSessionResponse>('/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return toSessionResult(res);
}

export async function updateAngerAfter(
  sessionId: string,
  angerAfter: number,
): Promise<SessionResult> {
  const res = await apiFetch<BackendSessionResponse>(
    `/api/v1/sessions/${sessionId}/anger-after`,
    {
      method: 'PATCH',
      body: JSON.stringify({ angerAfter }),
    },
  );
  return toSessionResult(res);
}

export async function updateMemo(
  sessionId: string,
  memo: string,
): Promise<SessionResult> {
  const res = await apiFetch<BackendSessionResponse>(
    `/api/v1/sessions/${sessionId}/memo`,
    {
      method: 'PATCH',
      body: JSON.stringify({ memo }),
    },
  );
  return toSessionResult(res);
}

export async function getRecentTargets(): Promise<string[]> {
  return apiFetch<string[]>('/api/v1/sessions/recent-targets');
}

export async function getRecentNicknames(): Promise<string[]> {
  return apiFetch<string[]>('/api/v1/sessions/recent-nicknames');
}