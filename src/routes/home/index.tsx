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

export function HomeRoute() {
  const navigate = useNavigate();
  const {
    homeSnapshot,
    reuseSessionDraft,
    sessions,
    resetDraft,
  } =
    useAppState();
  const recentSessions = sessions.slice(0, 3);
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
          <RecentList
            onReplay={(session) => {
              reuseSessionDraft(session);
              navigate("/play");
            }}
            sessions={recentSessions}
          />
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}
