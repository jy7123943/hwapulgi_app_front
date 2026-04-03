import { useNavigate } from 'react-router-dom';
import { AppShell, BodyStack, ScreenPanel } from '../../components/shared/Surface';
import { useAppState } from '../../state/AppState';
import { BottomCTA } from '../../components/shared/BottomCTA';
import { MascotHero } from '../../components/shared/MascotHero';
import { HomeStats } from './components/HomeStats';
import { RecentHero } from './components/RecentHero';
import { RecentList } from './components/RecentList';

export function HomeRoute() {
  const navigate = useNavigate();
  const { sessions, weeklySummary, resetDraft } = useAppState();
  const recentSessions = sessions.slice(0, 5);
  const hero = sessions[0];

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle="기록이 쌓일수록 내가 언제, 누구에게 가장 많이 소모되는지 보이기 시작해요."
            title={'이번 주 감정\n배출 흐름'}
          />

          <HomeStats weeklySummary={weeklySummary} />
          <RecentHero hero={hero} />
          <RecentList sessions={recentSessions} />
        </BodyStack>
      </ScreenPanel>

      <BottomCTA
        onClick={() => {
          resetDraft();
          navigate('/start/target');
        }}
      >
        지금 화풀기
      </BottomCTA>
    </AppShell>
  );
}
