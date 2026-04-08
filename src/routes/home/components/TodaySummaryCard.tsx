import { Text } from "@toss/tds-mobile";
import { SectionCard } from "../../../components/shared/Surface";
import type { SessionResult } from "../../../types";

interface TodaySummaryCardProps {
  sessions: SessionResult[];
}

export function TodaySummaryCard({ sessions }: TodaySummaryCardProps) {
  const totalHits = sessions.reduce((sum, session) => sum + session.hits, 0);
  const latestSession = sessions[0];
  const averageAnger =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, session) => sum + session.angerBefore, 0) /
            sessions.length,
        )
      : 0;
  const latestTarget = latestSession
    ? latestSession.customTarget?.trim() ||
      latestSession.nickname.trim() ||
      latestSession.target
    : "-";

  return (
    <SectionCard css={{ background: "#ffffff" }}>
      <div>
        <Text
          as="h3"
          typography="t4"
          fontWeight="bold"
          css={{ color: "#35214f" }}
        >
          오늘 기록
        </Text>
      </div>
      {sessions.length > 0 ? (
        <div css={{ marginTop: 12 }}>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div
              css={{
                padding: "16px 16px 14px",
                borderRadius: 22,
                background: "#dff8ee",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                justifyContent: "space-between",
              }}
            >
              <div>
                <Text
                  as="div"
                  typography="t7"
                  fontWeight="medium"
                  css={{ color: "#6a5b7f" }}
                >
                  오늘 평균 분노
                </Text>
              </div>
              <div>
                <Text
                  as="div"
                  typography="t2"
                  fontWeight="bold"
                  css={{ color: "#249f78" }}
                >
                  {averageAnger}
                </Text>
              </div>
            </div>
            <div
              css={{
                padding: "16px 16px 14px",
                borderRadius: 22,
                background: "#fff1f8",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                justifyContent: "space-between",
              }}
            >
              <div>
                <Text
                  as="div"
                  typography="t7"
                  fontWeight="medium"
                  css={{ color: "#6a5b7f" }}
                >
                  총 타격 수
                </Text>
              </div>
              <div>
                <Text
                  as="div"
                  typography="t2"
                  fontWeight="bold"
                  css={{ color: "#e56ca0" }}
                >
                  {totalHits}
                </Text>
              </div>
            </div>
          </div>

          <div
            css={{
              marginTop: 12,
              padding: "16px 16px 14px",
              borderRadius: 22,
              background: "#f8f4ff",
              minHeight: 82,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text
                as="div"
                typography="t7"
                fontWeight="medium"
                css={{ color: "#6a5b7f" }}
              >
                가장 최근 대상
              </Text>
            </div>
            <div>
              <Text
                as="div"
                typography="t3"
                fontWeight="bold"
                css={{
                  color: "#5b3f85",
                  wordBreak: "keep-all",
                  overflowWrap: "anywhere",
                }}
              >
                {latestTarget}
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div css={{ marginTop: 10 }}>
          <Text as="p" typography="t7" css={{ color: "#6a5b7f" }}>
            오늘은 아직 꺼내놓은 감정이 없어요. 필요할 때 바로 시작해도
            괜찮아요.
          </Text>
        </div>
      )}
    </SectionCard>
  );
}
