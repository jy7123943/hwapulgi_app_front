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

export function updateSession(updatedSession: SessionResult) {
  const sessions = loadSessions().map((session) =>
    session.id === updatedSession.id ? updatedSession : session,
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
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
      topTargets: [],
    };
  }

  const totalBefore = weeklySessions.reduce((sum, session) => sum + session.angerBefore, 0);
  const totalAfter = weeklySessions.reduce((sum, session) => sum + session.angerAfter, 0);
  const targetCounts = weeklySessions.reduce<Record<string, number>>((accumulator, session) => {
    const label = formatSessionLabel(session);
    accumulator[label] = (accumulator[label] ?? 0) + 1;
    return accumulator;
  }, {});
  const topTargets = Object.entries(targetCounts)
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0], "ko");
    })
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));

  return {
    totalSessions: weeklySessions.length,
    totalHits: weeklySessions.reduce((sum, session) => sum + session.hits, 0),
    averageBefore: Math.round(totalBefore / weeklySessions.length),
    averageAfter: Math.round(totalAfter / weeklySessions.length),
    bestRelease: Math.max(...weeklySessions.map((session) => session.releasedPercent)),
    topTargets,
  };
}

export function formatSessionLabel(session: SessionResult) {
  return session.customTarget?.trim() || session.nickname.trim() || session.target;
}
