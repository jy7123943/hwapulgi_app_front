import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { INTRO_SEEN_STORAGE_KEY, defaultDraft } from '../constants';
import {
  useCreateSession,
  useRecentNicknames,
  useRecentTargets,
  useSessions,
  useUpdateAngerAfter,
  useUpdateMemo,
} from '../lib/queries/sessions';
import type {
  AvatarGender,
  SessionInput,
  SessionResult,
  TargetOption,
} from '../types';

interface AppStateValue {
  draft: SessionInput;
  isHydrated: boolean;
  recentCustomTargets: string[];
  recentNicknames: string[];
  lastResult: SessionResult | null;
  hasHistory: boolean;
  introSeen: boolean;
  setTarget: (target: TargetOption) => void;
  setCustomTarget: (value: string) => void;
  setNickname: (value: string) => void;
  setGender: (value: AvatarGender) => void;
  setAngerBefore: (value: number) => void;
  setMemo: (value: string) => void;
  resetDraft: () => void;
  reuseSessionDraft: (session: SessionResult) => void;
  updateLastResultAngerAfter: (angerAfter: number) => void;
  updateLastResultMemo: (memo: string) => Promise<void>;
  completeSession: (payload: {
    hits: number;
    skillShots: number;
    angerAfter: number;
  }) => Promise<SessionResult>;
  markIntroSeen: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<SessionInput>(defaultDraft);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [introSeen, setIntroSeen] = useState(false);

  const { data: sessions = [], isFetched: sessionsFetched } = useSessions();
  const { data: recentCustomTargets = [] } = useRecentTargets();
  const { data: recentNicknames = [] } = useRecentNicknames();
  const createSessionMutation = useCreateSession();
  const updateAngerMutation = useUpdateAngerAfter();
  const updateMemoMutation = useUpdateMemo();

  useEffect(() => {
    setIntroSeen(window.localStorage.getItem(INTRO_SEEN_STORAGE_KEY) === 'true');
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      draft,
      isHydrated: sessionsFetched,
      recentCustomTargets,
      recentNicknames,
      lastResult,
      hasHistory: sessions.length > 0,
      introSeen,
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
        const prev = lastResult;
        if (!prev) return;

        const releasedPercent = Math.max(
          0,
          Math.round(((prev.angerBefore - nextAngerAfter) / Math.max(prev.angerBefore, 1)) * 100),
        );
        setLastResult({ ...prev, angerAfter: nextAngerAfter, releasedPercent });
        updateAngerMutation.mutate({ sessionId: prev.id, angerAfter: nextAngerAfter });
      },
      updateLastResultMemo: async (memo) => {
        const prev = lastResult;
        if (!prev) return;
        setLastResult({ ...prev, memo });
        await updateMemoMutation.mutateAsync({ sessionId: prev.id, memo });
      },
      completeSession: async ({ hits, skillShots, angerAfter }) => {
        const nextAngerAfter = Math.trunc(angerAfter);
        const releasedPercent = Math.max(
          0,
          Math.round(
            ((draft.angerBefore - nextAngerAfter) / Math.max(draft.angerBefore, 1)) * 100,
          ),
        );
        const points =
          10 +
          hits +
          skillShots * 4 +
          Math.round((draft.angerBefore - Math.min(nextAngerAfter, draft.angerBefore)) / 2);

        const saved = await createSessionMutation.mutateAsync({
          draft,
          hits,
          skillShots,
          angerAfter: nextAngerAfter,
          releasedPercent,
          points,
        });
        const enriched: SessionResult = {
          ...saved,
          gender: draft.gender || 'boy',
        };
        setLastResult(enriched);
        return enriched;
      },
      markIntroSeen: () => {
        window.localStorage.setItem(INTRO_SEEN_STORAGE_KEY, 'true');
        setIntroSeen(true);
      },
    }),
    [
      draft,
      introSeen,
      lastResult,
      recentCustomTargets,
      recentNicknames,
      sessions.length,
      sessionsFetched,
      createSessionMutation,
      updateAngerMutation,
      updateMemoMutation,
    ],
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