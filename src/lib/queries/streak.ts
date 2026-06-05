import { useQuery } from '@tanstack/react-query';
import { getMyStreak } from '../api/streak';
import { queryKeys } from './keys';

export function useMyStreak() {
  return useQuery({
    queryKey: queryKeys.streak.me(),
    queryFn: getMyStreak,
  });
}