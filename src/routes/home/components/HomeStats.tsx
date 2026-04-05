import { colors } from "@toss/tds-colors";
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
          gap: 2,
        }}
      >
        <Text
          as="span"
          typography="t7"
          css={{ display: "block", color: colors.grey600 }}
        >
          총 타격 수
        </Text>
        <strong css={{ color: "#6f48c9" }}>{weeklySummary.totalHits}</strong>
      </StatCard>
      <StatCard
        css={{
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Text
          as="span"
          typography="t7"
          css={{ display: "block", color: colors.grey600 }}
        >
          연속 기록
        </Text>
        <strong css={{ color: "#b36b13" }}>{weeklySummary.streakDays}일</strong>
      </StatCard>
    </StatsGrid>
  );
}
