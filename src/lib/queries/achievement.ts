import { useQuery } from '@tanstack/react-query';
import { getMyAchievements } from '../api/achievement';
import { queryKeys } from './keys';

export function useMyAchievements() {
  return useQuery({
    queryKey: queryKeys.achievement.me(),
    queryFn: getMyAchievements,
  });
}