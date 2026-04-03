import { STORAGE_KEY } from '../constants';
import type { SessionResult, WeeklySummary } from '../types';

export function loadSessions(): SessionResult[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SessionResult[];
    return parsed.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } catch {
    return [];
  }
}

export function saveSession(session: SessionResult) {
  const sessions = loadSessions();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions]));
}

export function getWeeklySummary(sessions: SessionResult[]): WeeklySummary {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklySessions = sessions.filter((session) => +new Date(session.createdAt) >= weekAgo);

  if (weeklySessions.length === 0) {
    return {
      totalSessions: 0,
      totalHits: 0,
      averageBefore: 0,
      averageAfter: 0,
      bestRelease: 0,
    };
  }

  const totalBefore = weeklySessions.reduce((sum, session) => sum + session.angerBefore, 0);
  const totalAfter = weeklySessions.reduce((sum, session) => sum + session.angerAfter, 0);

  return {
    totalSessions: weeklySessions.length,
    totalHits: weeklySessions.reduce((sum, session) => sum + session.hits, 0),
    averageBefore: Math.round(totalBefore / weeklySessions.length),
    averageAfter: Math.round(totalAfter / weeklySessions.length),
    bestRelease: Math.max(...weeklySessions.map((session) => session.releasedPercent)),
  };
}

export function formatSessionLabel(session: SessionResult) {
  return session.customTarget?.trim() || session.nickname.trim() || session.target;
}
