import { useQuery } from '@tanstack/react-query';
import { listSessions } from '../api/sessions';
import { queryKeys } from './keys';

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.list(),
    queryFn: listSessions,
  });
}