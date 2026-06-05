import { useQuery } from '@tanstack/react-query';
import { getArchives, getWeeklyReport } from '../api/report';
import { queryKeys } from './keys';

export function useWeeklyReport() {
  return useQuery({
    queryKey: queryKeys.report.weekly(),
    queryFn: getWeeklyReport,
  });
}

export function useArchives() {
  return useQuery({
    queryKey: queryKeys.report.archives(),
    queryFn: getArchives,
  });
}