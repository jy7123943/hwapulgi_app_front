import { useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
} from "../../components/shared/Surface";
import { useAppState } from "../../state/AppState";
import { BottomCTA } from "../../components/shared/BottomCTA";
import { MascotHero } from "../../components/shared/MascotHero";
import { HomeStats } from "./components/HomeStats";
import { RecentList } from "./components/RecentList";
import { TopTargetsCard } from "./components/TopTargetsCard";
import { WeeklyCalendarCard } from "./components/WeeklyCalendarCard";
import { SectionCard } from "../../components/shared/Surface";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";

export function HomeRoute() {
  const navigate = useNavigate();
  const { sessions, weeklySummary, resetDraft } = useAppState();
  const recentSessions = sessions.slice(0, 5);
  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            compact
            type="happy"
            subtitle={
              "기록이 쌓일수록 내가 언제, 누구에게\n가장 많이 소모되는지 보이기 시작해요."
            }
            title={"이번 주 기록"}
          />

          <HomeStats weeklySummary={weeklySummary} />
          <SectionCard
            css={{
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Text
              as="h3"
              typography="t6"
              fontWeight="bold"
              css={{ color: colors.grey900 }}
            >
              이번 주 한 줄 요약
            </Text>
            <Text as="p" typography="t6" css={{ color: colors.grey700 }}>
              {weeklySummary.weeklyHeadline}
            </Text>
          </SectionCard>
          <WeeklyCalendarCard weeklySummary={weeklySummary} />
          <TopTargetsCard weeklySummary={weeklySummary} />
          <RecentList sessions={recentSessions} />
        </BodyStack>
      </ScreenPanel>

      <BottomCTA
        onClick={() => {
          resetDraft();
          navigate("/start/target");
        }}
      >
        지금 화풀기
      </BottomCTA>
    </AppShell>
  );
}
