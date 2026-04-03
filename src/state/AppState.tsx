import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { defaultDraft } from '../constants';
import { getWeeklySummary, loadSessions, saveSession, updateSession } from '../lib/storage';
import type { SessionInput, SessionResult, TargetOption } from '../types';

interface AppStateValue {
  draft: SessionInput;
  sessions: SessionResult[];
  weeklySummary: ReturnType<typeof getWeeklySummary>;
  lastResult: SessionResult | null;
  hasHistory: boolean;
  setTarget: (target: TargetOption) => void;
  setCustomTarget: (value: string) => void;
  setNickname: (value: string) => void;
  setAngerBefore: (value: number) => void;
  setMemo: (value: string) => void;
  resetDraft: () => void;
  updateLastResultAngerAfter: (angerAfter: number) => void;
  completeSession: (payload: {
    hits: number;
    skillShots: number;
    angerAfter: number;
  }) => SessionResult;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<SessionInput>(defaultDraft);
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const weeklySummary = useMemo(() => getWeeklySummary(sessions), [sessions]);

  const value = useMemo<AppStateValue>(
    () => ({
      draft,
      sessions,
      weeklySummary,
      lastResult,
      hasHistory: sessions.length > 0,
      setTarget: (target) =>
        setDraft((prev) => ({
          ...prev,
          target,
          customTarget: target === '기타' ? prev.customTarget : '',
        })),
      setCustomTarget: (value) => setDraft((prev) => ({ ...prev, customTarget: value })),
      setNickname: (value) => setDraft((prev) => ({ ...prev, nickname: value })),
      setAngerBefore: (value) => setDraft((prev) => ({ ...prev, angerBefore: value })),
      setMemo: (value) => setDraft((prev) => ({ ...prev, memo: value })),
      resetDraft: () => setDraft(defaultDraft),
      updateLastResultAngerAfter: (angerAfter) => {
        const nextAngerAfter = Math.trunc(angerAfter);

        setLastResult((prev) => {
          if (!prev) {
            return prev;
          }

          const updatedResult: SessionResult = {
            ...prev,
            angerAfter: nextAngerAfter,
            releasedPercent: Math.max(
              0,
              Math.round(((prev.angerBefore - nextAngerAfter) / Math.max(prev.angerBefore, 1)) * 100),
            ),
          };

          updateSession(updatedResult);
          setSessions(loadSessions());
          return updatedResult;
        });
      },
      completeSession: ({ hits, skillShots, angerAfter }) => {
        const nextAngerAfter = Math.trunc(angerAfter);
        const result: SessionResult = {
          ...draft,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          hits,
          skillShots,
          angerAfter: nextAngerAfter,
          releasedPercent: Math.max(
            0,
            Math.round(((draft.angerBefore - nextAngerAfter) / Math.max(draft.angerBefore, 1)) * 100),
          ),
          points:
            10 + hits + skillShots * 4 + Math.round((draft.angerBefore - Math.min(nextAngerAfter, draft.angerBefore)) / 2),
        };

        saveSession(result);
        const updatedSessions = loadSessions();
        setSessions(updatedSessions);
        setLastResult(result);
        return result;
      },
    }),
    [draft, lastResult, sessions, weeklySummary],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
