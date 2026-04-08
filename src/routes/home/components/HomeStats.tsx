import { Text } from "@toss/tds-mobile";
import { StatCard, StatsGrid } from "../../../components/shared/Surface";
import type { WeeklySummary } from "../../../types";

interface HomeStatsProps {
  weeklySummary: WeeklySummary;
}

export function HomeStats({ weeklySummary }: HomeStatsProps) {
  return (
    <StatsGrid>
      <StatCard
        css={{
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Text
          as="span"
          typography="t6"
          fontWeight="medium"
          css={{ display: "block", color: "#6a5b7f" }}
        >
          총 타격 수
        </Text>
        <strong css={{ color: "#3aa987", fontSize: 34 }}>{weeklySummary.totalHits}</strong>
      </StatCard>
      <StatCard
        css={{
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Text
          as="span"
          typography="t6"
          fontWeight="medium"
          css={{ display: "block", color: "#6a5b7f" }}
        >
          연속 기록
        </Text>
        <strong css={{ color: "#e56ca0", fontSize: 34 }}>{weeklySummary.streakDays}일</strong>
      </StatCard>
    </StatsGrid>
  );
}
