import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { BottomTabBar } from "../../components/shared/BottomTabBar";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
  SectionCard,
} from "../../components/shared/Surface";
import { MascotHero } from "../../components/shared/MascotHero";
import { CurrentWeekReportCard } from "../home/components/CurrentWeekReportCard";
import { HomeStats } from "../home/components/HomeStats";
import { TopTargetsCard } from "../home/components/TopTargetsCard";
import { useAppState } from "../../state/AppState";

export function ReportsRoute() {
  const { weeklyArchives, weeklySummary } = useAppState();
  const reportYear =
    weeklySummary.calendarDays[0] != null
      ? new Date(weeklySummary.calendarDays[0].dateKey).getFullYear()
      : new Date().getFullYear();

  return (
    <AppShell css={{ paddingBottom: 108 }}>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            compact
            type="happy"
            subtitle={
              "이번 주 흐름과 지난 리포트를\n차근차근 돌아볼 수 있어요."
            }
            title={`${reportYear}년 ${weeklySummary.label}`}
          />

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
            <Text as="p" typography="t7" css={{ color: colors.grey700 }}>
              {weeklySummary.weeklyHeadline}
            </Text>
          </SectionCard>

          <CurrentWeekReportCard weeklySummary={weeklySummary} />
          <HomeStats weeklySummary={weeklySummary} />
          <TopTargetsCard weeklySummary={weeklySummary} />

          <SectionCard css={{ background: "#ffffff" }}>
            <Text
              as="h3"
              typography="t6"
              fontWeight="bold"
              css={{ color: colors.grey900 }}
            >
              지난 주간 리포트
            </Text>

            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 14,
              }}
            >
              {weeklyArchives.length > 0 ? (
                weeklyArchives.map((archive) => (
                  <div
                    key={archive.id}
                    css={{
                      padding: 16,
                      borderRadius: 18,
                      background: colors.grey50,
                    }}
                  >
                    <Text
                      as="div"
                      typography="t6"
                      fontWeight="bold"
                      css={{ color: colors.grey900 }}
                    >
                      {archive.label}
                    </Text>
                    <Text
                      as="div"
                      typography="t7"
                      css={{ color: colors.grey600, marginTop: 4 }}
                    >
                      {archive.periodText}
                    </Text>
                    <Text
                      as="div"
                      typography="t7"
                      css={{ color: colors.grey600, marginTop: 8 }}
                    >
                      평균 배출량 {archive.averageRelease}% · 총{" "}
                      {archive.totalHits} hits
                    </Text>
                    <Text
                      as="div"
                      typography="t7"
                      css={{ color: colors.grey600, marginTop: 2 }}
                    >
                      가장 힘들었던 날 {archive.hardestWeekday} · TOP 대상{" "}
                      {archive.topTarget}
                    </Text>
                  </div>
                ))
              ) : (
                <Text as="p" typography="t7" css={{ color: colors.grey600 }}>
                  아직 지난 리포트가 없어요.
                </Text>
              )}
            </div>
          </SectionCard>
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}
