import { useQuery } from '@tanstack/react-query';
import {
  RankingCriteria,
  RankingPeriod,
  getMyRanking,
  getPointsRanking,
  getReleaseRateRanking,
} from '../api/ranking';
import { queryKeys } from './keys';

export function usePointsRanking(period: RankingPeriod = 'weekly') {
  return useQuery({
    queryKey: [...queryKeys.ranking.points(period)],
    queryFn: () => getPointsRanking(period),
  });
}

export function useReleaseRateRanking(period: RankingPeriod = 'weekly') {
  return useQuery({
    queryKey: [...queryKeys.ranking.releaseRate(period)],
    queryFn: () => getReleaseRateRanking(period),
  });
}

export function useMyRanking(
  criteria: RankingCriteria = 'points',
  period: RankingPeriod = 'weekly',
) {
  return useQuery({
    queryKey: [...queryKeys.ranking.me(), criteria, period],
    queryFn: () => getMyRanking(criteria, period),
  });
}
