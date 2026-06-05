import { useState } from "react";
import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
  SectionCard,
} from "../../components/shared/Surface";
import { BottomTabBar } from "../../components/shared/BottomTabBar";
import { useAppState } from "../../state/AppState";
import {
  useMyRanking,
  usePointsRanking,
  useReleaseRateRanking,
} from "../../lib/queries/ranking";
import type {
  RankingCriteria,
  RankingPeriod,
} from "../../lib/api/ranking";

const PERIOD_OPTIONS: { value: RankingPeriod; label: string }[] = [
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
  { value: "all-time", label: "전체" },
];

const CRITERIA_OPTIONS: { value: RankingCriteria; label: string }[] = [
  { value: "points", label: "포인트" },
  { value: "release", label: "해소율" },
];

function formatScore(criteria: RankingCriteria, score: number) {
  return criteria === "release" ? `${Math.round(score)}%` : `${Math.round(score)}P`;
}

export function RankingRoute() {
  const [period, setPeriod] = useState<RankingPeriod>("weekly");
  const [criteria, setCriteria] = useState<RankingCriteria>("points");

  const pointsQuery = usePointsRanking(period);
  const releaseQuery = useReleaseRateRanking(period);
  const myRanking = useMyRanking(criteria, period);
  const { lastResult } = useAppState();

  const list =
    criteria === "points" ? pointsQuery.data ?? [] : releaseQuery.data ?? [];
  const isLoading =
    criteria === "points" ? pointsQuery.isLoading : releaseQuery.isLoading;
  const myUserId = (() => {
    // lastResult.id가 세션 id라 user 식별 불가 — 닉네임으로 임시 강조
    return null as number | null;
  })();
  void myUserId;
  void lastResult;

  return (
    <AppShell css={{ paddingBottom: 108 }}>
      <ScreenPanel>
        <BodyStack css={{ gap: 12 }}>
          <section
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "12px 12px 4px",
              textAlign: "center",
            }}
          >
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
              랭킹
            </Text>
            <Text
              as="p"
              typography="t5"
              css={{ color: "#effff7", opacity: 0.96, marginTop: 6 }}
            >
              {"오늘 화 가장 잘 푼 사람은 누구일까요?"}
            </Text>
          </section>

          <SectionCard
            css={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <Text
              as="div"
              typography="t6"
              fontWeight="bold"
              css={{ color: colors.grey900 }}
            >
              내 순위
            </Text>
            {myRanking.isLoading ? (
              <Text typography="t7" css={{ color: colors.grey500 }}>
                불러오는 중...
              </Text>
            ) : myRanking.data && myRanking.data.totalParticipants > 0 ? (
              <div
                css={{ display: "flex", alignItems: "baseline", gap: 10 }}
              >
                <Text
                  typography="t1"
                  fontWeight="bold"
                  css={{ color: "#c74a32" }}
                >
                  {myRanking.data.rank > 0 ? `${myRanking.data.rank}위` : "-"}
                </Text>
                <Text typography="t7" css={{ color: colors.grey600 }}>
                  / {myRanking.data.totalParticipants}명 중
                </Text>
                <Text
                  typography="t6"
                  fontWeight="bold"
                  css={{ color: colors.grey900, marginLeft: "auto" }}
                >
                  {formatScore(criteria, myRanking.data.score)}
                </Text>
              </div>
            ) : (
              <Text typography="t7" css={{ color: colors.grey500 }}>
                {period === "weekly"
                  ? "이번 주 기록부터 랭킹에 들어가요."
                  : "아직 집계할 데이터가 부족해요."}
              </Text>
            )}
          </SectionCard>

          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {CRITERIA_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCriteria(opt.value)}
                css={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "3px solid #4e356d",
                  background:
                    criteria === opt.value ? "#bff4d5" : "rgba(255,255,255,0.08)",
                  color: criteria === opt.value ? "#35214f" : "#fff4df",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                css={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "2px solid #4e356d",
                  background:
                    period === opt.value ? "#fff4df" : "rgba(255,255,255,0.05)",
                  color: period === opt.value ? "#35214f" : "#fff4df",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <SectionCard
            css={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
          >
            {isLoading ? (
              <Text
                typography="t7"
                css={{ color: colors.grey500, padding: 20 }}
              >
                불러오는 중...
              </Text>
            ) : list.length === 0 ? (
              <Text
                typography="t7"
                css={{ color: colors.grey500, padding: 20 }}
              >
                아직 랭킹 데이터가 없어요. 첫 번째가 되어볼래요?
              </Text>
            ) : (
              list.map((entry, index) => (
                <div
                  key={`${entry.userId}-${index}`}
                  css={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                    borderBottom:
                      index < list.length - 1
                        ? "1px solid rgba(78, 53, 109, 0.12)"
                        : undefined,
                  }}
                >
                  <Text
                    typography="t5"
                    fontWeight="bold"
                    css={{
                      color:
                        entry.rank === 1
                          ? "#c74a32"
                          : entry.rank <= 3
                            ? "#4cc49b"
                            : colors.grey700,
                      textAlign: "center",
                    }}
                  >
                    {entry.rank}
                  </Text>
                  <Text
                    typography="t6"
                    fontWeight="medium"
                    css={{
                      color: colors.grey900,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.nickname}
                  </Text>
                  <Text
                    typography="t6"
                    fontWeight="bold"
                    css={{ color: colors.grey900 }}
                  >
                    {formatScore(criteria, entry.score)}
                  </Text>
                </div>
              ))
            )}
          </SectionCard>
        </BodyStack>
      </ScreenPanel>
      <BottomTabBar />
    </AppShell>
  );
}