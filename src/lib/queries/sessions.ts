import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateSessionInput,
  createSession,
  getRecentNicknames,
  getRecentTargets,
  listSessions,
  updateAngerAfter,
  updateMemo,
} from '../api/sessions';
import { queryKeys } from './keys';

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.list(),
    queryFn: listSessions,
  });
}

export function useRecentTargets() {
  return useQuery({
    queryKey: queryKeys.sessions.recentTargets(),
    queryFn: getRecentTargets,
  });
}

export function useRecentNicknames() {
  return useQuery({
    queryKey: queryKeys.sessions.recentNicknames(),
    queryFn: getRecentNicknames,
  });
}

function invalidateAllSessionDerived(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
  qc.invalidateQueries({ queryKey: queryKeys.home.snapshot() });
  qc.invalidateQueries({ queryKey: queryKeys.report.weekly() });
  qc.invalidateQueries({ queryKey: queryKeys.report.archives() });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSessionInput) => createSession(input),
    onSuccess: () => invalidateAllSessionDerived(qc),
  });
}

export function useUpdateAngerAfter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, angerAfter }: { sessionId: string; angerAfter: number }) =>
      updateAngerAfter(sessionId, angerAfter),
    onSuccess: () => invalidateAllSessionDerived(qc),
  });
}

export function useUpdateMemo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, memo }: { sessionId: string; memo: string }) =>
      updateMemo(sessionId, memo),
    onSuccess: () => invalidateAllSessionDerived(qc),
  });
}