import { useEffect, useMemo, useState } from "react";
import { Asset, Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { BottomTabBar } from "../../components/shared/BottomTabBar";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
  SectionCard,
} from "../../components/shared/Surface";
import { CurrentWeekReportCard } from "../home/components/CurrentWeekReportCard";
import { HomeStats } from "../home/components/HomeStats";
import { TopTargetsCard } from "../home/components/TopTargetsCard";
import { useArchives, useWeeklyReport } from "../../lib/queries/report";
import { AchievementsList } from "./components/AchievementsList";

export function ReportsRoute() {
  const { data: archives = [] } = useArchives();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 0 = 이번 주, 1+ = archives[i-1]
  const totalWeeks = 1 + archives.length;
  const selectedWeekKey =
    selectedIndex === 0 ? undefined : archives[selectedIndex - 1]?.id;
  const { data: selectedSummary } = useWeeklyReport(selectedWeekKey);

  // 새 데이터 들어올 때 인덱스 범위 보정
  useEffect(() => {
    if (selectedIndex >= totalWeeks) {
      setSelectedIndex(0);
    }
  }, [totalWeeks, selectedIndex]);

  const reportYear =
    selectedSummary?.calendarDays[0] != null
      ? new Date(selectedSummary.calendarDays[0].dateKey).getFullYear()
      : new Date().getFullYear();
  const canGoPrev = selectedIndex < totalWeeks - 1;
  const canGoNext = selectedIndex > 0;

  return (
    <AppShell css={{ paddingBottom: 108 }}>
      <ScreenPanel>
        <BodyStack css={{ gap: 12 }}>
          <section
            css={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
              padding: "12px 12px 4px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => Math.min(prev + 1, totalWeeks - 1))
              }
              disabled={!canGoPrev}
              css={{
                position: "absolute",
                left: 0,
                top: 20,
                width: 42,
                height: 42,
                borderRadius: 999,
                border: "3px solid #4e356d",
                background: canGoPrev ? "#bff4d5" : "#6a5b7f",
                color: "#35214f",
                fontSize: 24,
                fontWeight: 900,
                display: "grid",
                placeItems: "center",
                opacity: canGoPrev ? 1 : 0.6,
              }}
            >
              <Asset.Icon name="icon-arrow-left-mono" color={"#35214f"} />
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => Math.max(prev - 1, 0))}
              disabled={!canGoNext}
              css={{
                position: "absolute",
                right: 0,
                top: 20,
                width: 42,
                height: 42,
                borderRadius: 999,
                border: "3px solid #4e356d",
                background: canGoNext ? "#bff4d5" : "#6a5b7f",
                color: "#35214f",
                fontSize: 24,
                fontWeight: 900,
                display: "grid",
                placeItems: "center",
                opacity: canGoNext ? 1 : 0.6,
              }}
            >
              <Asset.Icon name="icon-arrow-right-mono" color={"#35214f"} />
            </button>

            <Text
              as="div"
              typography="t5"
              fontWeight="bold"
              css={{
                color: "#fff4df",
                opacity: 0.9,
              }}
            >
              {reportYear}년
            </Text>
            <Text
              as="h1"
              typography="t1"
              fontWeight="bold"
              css={{
                color: "#fff4df",
                textShadow:
                  "-1.5px -1.5px 0 #4e356d, 1.5px -1.5px 0 #4e356d, -1.5px 1.5px 0 #4e356d, 1.5px 1.5px 0 #4e356d",
                letterSpacing: "-0.05em",
              }}
            >
              {selectedSummary?.label ?? "이번 주"}
            </Text>
            <Text
              as="p"
              typography="t5"
              fontWeight="medium"
              css={{
                color: "#effff7",
                opacity: 0.96,
                marginTop: 8,
              }}
            >
              {"이번 주 흐름과 지난 기록을\n차근차근 돌아볼 수 있어요."}
            </Text>
          </section>

          <SectionCard
            css={{
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <Text
              as="h3"
              typography="t6"
              fontWeight="bold"
              css={{ color: colors.grey900 }}
            >
              한 줄 요약
            </Text>
            <Text as="p" typography="t7" css={{ color: colors.grey700 }}>
              {selectedSummary?.weeklyHeadline}
            </Text>
          </SectionCard>

          {selectedSummary ? (
            <>
              <CurrentWeekReportCard weeklySummary={selectedSummary} />
              <HomeStats weeklySummary={selectedSummary} />
              <TopTargetsCard weeklySummary={selectedSummary} />
            </>
          ) : null}
          <AchievementsList />
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}
