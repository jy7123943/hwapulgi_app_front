export const queryKeys = {
  sessions: {
    all: ['sessions'] as const,
    list: () => [...queryKeys.sessions.all, 'list'] as const,
    recentTargets: () => [...queryKeys.sessions.all, 'recent-targets'] as const,
    recentNicknames: () => [...queryKeys.sessions.all, 'recent-nicknames'] as const,
  },
  home: {
    snapshot: () => ['home', 'snapshot'] as const,
  },
  report: {
    weekly: () => ['report', 'weekly'] as const,
    archives: () => ['report', 'archives'] as const,
  },
  ranking: {
    me: () => ['ranking', 'me'] as const,
    points: (period: string) => ['ranking', 'points', period] as const,
    releaseRate: (period: string) => ['ranking', 'release-rate', period] as const,
  },
  achievement: {
    me: () => ['achievement', 'me'] as const,
  },
  streak: {
    me: () => ['streak', 'me'] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
    stats: () => ['user', 'me', 'stats'] as const,
    targetStats: () => ['user', 'me', 'target-stats'] as const,
  },
};
