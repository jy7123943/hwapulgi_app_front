import { useEffect, useState } from "react";
import { Text } from "@toss/tds-mobile";
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
import { useAppState } from "../../state/AppState";

export function ReportsRoute() {
  const { weeklySummaries } = useAppState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [weeklySummaries.length]);

  const selectedSummary = weeklySummaries[selectedIndex] ?? weeklySummaries[0];
  const reportYear =
    selectedSummary?.calendarDays[0] != null
      ? new Date(selectedSummary.calendarDays[0].dateKey).getFullYear()
      : new Date().getFullYear();
  const canGoPrev = selectedIndex < weeklySummaries.length - 1;
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
              gap: 8,
              padding: "12px 12px 4px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) =>
                  Math.min(prev + 1, weeklySummaries.length - 1),
                )
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
                opacity: canGoPrev ? 1 : 0.45,
              }}
            >
              ‹
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
                opacity: canGoNext ? 1 : 0.45,
              }}
            >
              ›
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
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}
