import { STORAGE_KEY } from '../constants';
import type { SessionResult, WeeklySummary } from '../types';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
      totalReleased: 0,
      hardestWeekday: '-',
      streakDays: 0,
      weeklyHeadline: '이번 주 감정 기록을 시작해보세요.',
      topTargets: [],
      calendarDays: [],
    };
  }

  const totalBefore = weeklySessions.reduce((sum, session) => sum + session.angerBefore, 0);
  const totalAfter = weeklySessions.reduce((sum, session) => sum + session.angerAfter, 0);
  const totalReleased = weeklySessions.reduce(
    (sum, session) => sum + Math.max(0, Math.trunc(session.angerBefore) - Math.trunc(session.angerAfter)),
    0,
  );
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

  const weekdayScores = weeklySessions.reduce<Record<number, number>>((accumulator, session) => {
    const weekday = new Date(session.createdAt).getDay();
    accumulator[weekday] = (accumulator[weekday] ?? 0) + session.angerBefore;
    return accumulator;
  }, {});
  const hardestWeekdayEntry = Object.entries(weekdayScores).sort((left, right) => Number(right[1]) - Number(left[1]))[0];
  const hardestWeekday = hardestWeekdayEntry ? `${WEEKDAY_LABELS[Number(hardestWeekdayEntry[0])]}요일` : '-';

  const sessionsByDate = weeklySessions.reduce<Record<string, SessionResult[]>>((accumulator, session) => {
    const dateKey = getDateKey(new Date(session.createdAt));
    accumulator[dateKey] = [...(accumulator[dateKey] ?? []), session].sort(
      (left, right) => +new Date(right.createdAt) - +new Date(left.createdAt),
    );
    return accumulator;
  }, {});

  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const dateKey = getDateKey(date);
    const daySessions = sessionsByDate[dateKey] ?? [];
    const angerLevel = daySessions.length > 0 ? Math.max(...daySessions.map((session) => session.angerBefore)) : 0;

    return {
      dateKey,
      dayLabel: WEEKDAY_LABELS[date.getDay()],
      dayNumber: date.getDate(),
      angerLevel,
      sessions: daySessions,
    };
  });

  let streakDays = 0;
  for (let index = calendarDays.length - 1; index >= 0; index -= 1) {
    if (calendarDays[index].sessions.length === 0) {
      break;
    }
    streakDays += 1;
  }

  const primaryTarget = topTargets[0]?.label;
  const weeklyHeadline = primaryTarget
    ? `${hardestWeekday}에 ${primaryTarget} 때문에 가장 힘들었어요.`
    : `${hardestWeekday}에 감정 기복이 가장 컸어요.`;

  return {
    totalSessions: weeklySessions.length,
    totalHits: weeklySessions.reduce((sum, session) => sum + session.hits, 0),
    averageBefore: Math.round(totalBefore / weeklySessions.length),
    averageAfter: Math.round(totalAfter / weeklySessions.length),
    bestRelease: Math.max(...weeklySessions.map((session) => session.releasedPercent)),
    totalReleased,
    hardestWeekday,
    streakDays,
    weeklyHeadline,
    topTargets,
    calendarDays,
  };
}

export function formatSessionLabel(session: SessionResult) {
  return session.customTarget?.trim() || session.nickname.trim() || session.target;
}
