import { STORAGE_KEY } from '../constants';
import type { HomeSnapshot, SessionResult, WeeklyArchive, WeeklySummary } from '../types';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(input: Date) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function endOfWeek(input: Date) {
  const date = startOfWeek(input);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
}

function getWeekLabel(input: Date) {
  const date = new Date(input);
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = startOfWeek(monthStart);
  const currentWeekStart = startOfWeek(date);
  const weekIndex =
    Math.floor((currentWeekStart.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${date.getMonth() + 1}월 ${weekIndex}주차`;
}

function getWeekPeriodText(input: Date) {
  const weekStart = startOfWeek(input);
  const weekEnd = endOfWeek(input);
  return `${weekStart.getMonth() + 1}.${weekStart.getDate()} - ${weekEnd.getMonth() + 1}.${weekEnd.getDate()}`;
}

function getDailyAngerLevel(sessions: SessionResult[]) {
  if (sessions.length === 0) {
    return 0;
  }

  const averageBefore =
    sessions.reduce((sum, session) => sum + session.angerBefore, 0) /
    sessions.length;
  const sessionWeight = Math.max(0, sessions.length - 1) * 8;

  return Math.min(100, Math.round(averageBefore + sessionWeight));
}

function buildWeeklySummary(
  weeklySessions: SessionResult[],
  label: string,
  referenceDate: Date,
): WeeklySummary {
  if (weeklySessions.length === 0) {
    return {
      label,
      averageRelease: 0,
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
    const itemLabel = formatSessionLabel(session);
    accumulator[itemLabel] = (accumulator[itemLabel] ?? 0) + 1;
    return accumulator;
  }, {});
  const topTargets = Object.entries(targetCounts)
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0], 'ko');
    })
    .slice(0, 3)
    .map(([itemLabel, count]) => ({ label: itemLabel, count }));

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

  const weekStart = startOfWeek(referenceDate);
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    const dateKey = getDateKey(date);
    const daySessions = sessionsByDate[dateKey] ?? [];
    const angerLevel = getDailyAngerLevel(daySessions);

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
    label,
    averageRelease: Math.round(
      weeklySessions.reduce((sum, session) => sum + session.releasedPercent, 0) / weeklySessions.length,
    ),
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
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const weeklySessions = sessions.filter((session) => {
    const createdAt = +new Date(session.createdAt);
    return createdAt >= +weekStart && createdAt <= +weekEnd;
  });

  return buildWeeklySummary(weeklySessions, getWeekLabel(now), now);
}

export function getWeeklyArchives(sessions: SessionResult[]): WeeklyArchive[] {
  const grouped = sessions.reduce<Record<string, SessionResult[]>>((accumulator, session) => {
    const createdAt = new Date(session.createdAt);
    const weekStart = startOfWeek(createdAt);
    const key = getDateKey(weekStart);
    accumulator[key] = [...(accumulator[key] ?? []), session];
    return accumulator;
  }, {});

  const currentWeekKey = getDateKey(startOfWeek(new Date()));

  return Object.entries(grouped)
    .sort((left, right) => +new Date(right[0]) - +new Date(left[0]))
    .filter(([key]) => key !== currentWeekKey)
    .map(([key, weeklySessions]) => {
      const referenceDate = new Date(key);
      const summary = buildWeeklySummary(weeklySessions, getWeekLabel(referenceDate), referenceDate);

      return {
        id: key,
        label: summary.label,
        periodText: getWeekPeriodText(referenceDate),
        totalSessions: summary.totalSessions,
        totalHits: summary.totalHits,
        totalReleased: summary.totalReleased,
        averageBefore: summary.averageBefore,
        averageAfter: summary.averageAfter,
        averageRelease: summary.averageRelease,
        topTarget: summary.topTargets[0]?.label ?? '-',
        hardestWeekday: summary.hardestWeekday,
      };
    });
}

export function getWeeklySummaries(sessions: SessionResult[]): WeeklySummary[] {
  const grouped = sessions.reduce<Record<string, SessionResult[]>>((accumulator, session) => {
    const createdAt = new Date(session.createdAt);
    const weekStart = startOfWeek(createdAt);
    const key = getDateKey(weekStart);
    accumulator[key] = [...(accumulator[key] ?? []), session];
    return accumulator;
  }, {});

  const currentWeekKey = getDateKey(startOfWeek(new Date()));

  const summaries = Object.entries(grouped)
    .sort((left, right) => +new Date(right[0]) - +new Date(left[0]))
    .map(([key, weeklySessions]) => {
      const referenceDate = new Date(key);
      return buildWeeklySummary(weeklySessions, getWeekLabel(referenceDate), referenceDate);
    });

  const hasCurrentWeek = Object.prototype.hasOwnProperty.call(grouped, currentWeekKey);

  if (!hasCurrentWeek) {
    summaries.unshift(getWeeklySummary(sessions));
  }

  return summaries;
}

export function getHomeSnapshot(sessions: SessionResult[], weeklySummary: WeeklySummary): HomeSnapshot {
  const todayKey = getDateKey(new Date());
  const todaySessions = sessions.filter((session) => getDateKey(new Date(session.createdAt)) === todayKey);
  const latestSession = sessions[0];

  return {
    todayCount: todaySessions.length,
    latestTarget: latestSession ? formatSessionLabel(latestSession) : '-',
    primaryTarget: weeklySummary.topTargets[0]?.label ?? '-',
    weeklySessions: weeklySummary.totalSessions,
    weeklyAverageRelease: weeklySummary.averageRelease,
  };
}

export function formatSessionLabel(session: SessionResult) {
  return session.customTarget?.trim() || session.nickname.trim() || session.target;
}
