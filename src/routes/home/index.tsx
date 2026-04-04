import { useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
} from "../../components/shared/Surface";
import { BottomTabBar } from "../../components/shared/BottomTabBar";
import { useAppState } from "../../state/AppState";
import { HomeHeroBanner } from "./components/HomeHeroBanner";
import { RecentList } from "./components/RecentList";
import { TodaySummaryCard } from "./components/TodaySummaryCard";

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}

export function HomeRoute() {
  const navigate = useNavigate();
  const {
    homeSnapshot,
    sessions,
    resetDraft,
  } =
    useAppState();
  const todayKey = getDateKey(new Date());
  const todaySessions = sessions.filter(
    (session) => getDateKey(new Date(session.createdAt)) === todayKey,
  );
  return (
    <AppShell css={{ paddingBottom: 108 }}>
      <ScreenPanel>
        <BodyStack>
          <HomeHeroBanner
            onStart={() => {
              resetDraft();
              navigate("/start/target");
            }}
            snapshot={homeSnapshot}
          />
          <TodaySummaryCard sessions={todaySessions} />
          <RecentList sessions={todaySessions} />
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}
