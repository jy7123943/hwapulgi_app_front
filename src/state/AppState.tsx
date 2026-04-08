import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { defaultDraft } from '../constants';
import { getHomeSnapshot, getWeeklyArchives, getWeeklySummary, loadSessions, saveSession, updateSession } from '../lib/storage';
import type { AvatarGender, HomeSnapshot, SessionInput, SessionResult, TargetOption, WeeklyArchive } from '../types';

interface AppStateValue {
  draft: SessionInput;
  homeSnapshot: HomeSnapshot;
  sessions: SessionResult[];
  isHydrated: boolean;
  recentCustomTargets: string[];
  recentNicknames: string[];
  weeklyArchives: WeeklyArchive[];
  weeklySummary: ReturnType<typeof getWeeklySummary>;
  lastResult: SessionResult | null;
  hasHistory: boolean;
  setTarget: (target: TargetOption) => void;
  setCustomTarget: (value: string) => void;
  setNickname: (value: string) => void;
  setGender: (value: AvatarGender) => void;
  setAngerBefore: (value: number) => void;
  setMemo: (value: string) => void;
  resetDraft: () => void;
  reuseSessionDraft: (session: SessionResult) => void;
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
  const [sessions, setSessions] = useState<SessionResult[]>(() => loadSessions());
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
    setIsHydrated(true);
  }, []);

  const weeklySummary = useMemo(() => getWeeklySummary(sessions), [sessions]);
  const weeklyArchives = useMemo(() => getWeeklyArchives(sessions), [sessions]);
  const homeSnapshot = useMemo(() => getHomeSnapshot(sessions, weeklySummary), [sessions, weeklySummary]);
  const recentCustomTargets = useMemo(
    () =>
      Array.from(
        new Set(
          sessions
            .map((session) => session.customTarget?.trim() ?? '')
            .filter((target) => target.length > 0),
        ),
      ).slice(0, 6),
    [sessions],
  );
  const recentNicknames = useMemo(
    () =>
      Array.from(
        new Set(
          sessions
            .map((session) => session.nickname.trim())
            .filter((nickname) => nickname.length > 0),
        ),
      ).slice(0, 5),
    [sessions],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      draft,
      homeSnapshot,
      sessions,
      isHydrated,
      recentCustomTargets,
      recentNicknames,
      weeklyArchives,
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
      setGender: (value) => setDraft((prev) => ({ ...prev, gender: value })),
      setAngerBefore: (value) => setDraft((prev) => ({ ...prev, angerBefore: value })),
      setMemo: (value) => setDraft((prev) => ({ ...prev, memo: value })),
      resetDraft: () => setDraft(defaultDraft),
      reuseSessionDraft: (session) =>
        setDraft({
          target: session.target,
          customTarget: session.customTarget ?? '',
          nickname: session.nickname,
          gender: session.gender ?? 'boy',
          angerBefore: session.angerBefore,
          memo: session.memo,
        }),
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
          customTarget: draft.customTarget?.trim() ?? '',
          memo: draft.memo.trim(),
          nickname: draft.nickname.trim(),
          gender: draft.gender || 'boy',
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
    [draft, homeSnapshot, isHydrated, lastResult, recentCustomTargets, recentNicknames, sessions, weeklyArchives, weeklySummary],
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
