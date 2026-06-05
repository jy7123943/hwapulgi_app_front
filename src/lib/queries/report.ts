import { useQuery } from '@tanstack/react-query';
import { getArchives, getWeeklyReport } from '../api/report';
import { queryKeys } from './keys';

export function useWeeklyReport(weekKey?: string) {
  return useQuery({
    queryKey: weekKey
      ? [...queryKeys.report.weekly(), weekKey]
      : queryKeys.report.weekly(),
    queryFn: () => getWeeklyReport(weekKey),
  });
}

export function useArchives() {
  return useQuery({
    queryKey: queryKeys.report.archives(),
    queryFn: getArchives,
  });
}
