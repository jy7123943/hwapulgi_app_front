import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { SectionCard } from "../../../components/shared/Surface";
import { useMyStreak } from "../../../lib/queries/streak";

export function StreakCard() {
  const { data, isLoading } = useMyStreak();

  if (isLoading) {
    return null;
  }

  const current = data?.currentStreak ?? 0;
  const best = data?.bestStreak ?? 0;
  const total = data?.totalPlayDays ?? 0;

  return (
    <SectionCard css={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div css={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <Text
          typography="t6"
          fontWeight="bold"
          css={{ color: colors.grey900 }}
        >
          연속 기록
        </Text>
        <Text typography="t8" css={{ color: colors.grey500, marginLeft: "auto" }}>
          누적 {total}일
        </Text>
      </div>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          alignItems: "end",
        }}
      >
        <div>
          <Text
            typography="t1"
            fontWeight="bold"
            css={{ color: current > 0 ? "#c74a32" : colors.grey400 }}
          >
            {current}
            <Text
              as="span"
              typography="t5"
              fontWeight="bold"
              css={{ color: colors.grey700, marginLeft: 4 }}
            >
              일
            </Text>
          </Text>
          <Text typography="t8" css={{ color: colors.grey600 }}>
            현재 스트릭
          </Text>
        </div>
        <div>
          <Text
            typography="t3"
            fontWeight="bold"
            css={{ color: "#4cc49b" }}
          >
            {best}
            <Text
              as="span"
              typography="t6"
              fontWeight="bold"
              css={{ color: colors.grey700, marginLeft: 4 }}
            >
              일
            </Text>
          </Text>
          <Text typography="t8" css={{ color: colors.grey600 }}>
            최고 기록
          </Text>
        </div>
      </div>
    </SectionCard>
  );
}