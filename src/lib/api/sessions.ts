import type { SessionResult } from '../../types';
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
