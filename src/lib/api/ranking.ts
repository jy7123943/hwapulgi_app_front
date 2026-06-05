import { apiFetch } from './client';

export type RankingPeriod = 'weekly' | 'monthly' | 'all-time';
export type RankingCriteria = 'points' | 'release';

export interface RankingEntry {
  rank: number;
  userId: number;
  nickname: string;
  score: number;
}

export interface MyRanking {
  rank: number;
  totalParticipants: number;
  score: number;
}

export async function getPointsRanking(
  period: RankingPeriod = 'weekly',
  limit = 50,
): Promise<RankingEntry[]> {
  return apiFetch<RankingEntry[]>(
    `/api/v1/rankings/points?period=${period}&limit=${limit}`,
  );
}

export async function getReleaseRateRanking(
  period: RankingPeriod = 'weekly',
  limit = 50,
): Promise<RankingEntry[]> {
  return apiFetch<RankingEntry[]>(
    `/api/v1/rankings/release-rate?period=${period}&limit=${limit}`,
  );
}

export async function getMyRanking(
  criteria: RankingCriteria = 'points',
  period: RankingPeriod = 'weekly',
): Promise<MyRanking> {
  return apiFetch<MyRanking>(
    `/api/v1/rankings/me?criteria=${criteria}&period=${period}`,
  );
}