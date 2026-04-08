import { Text } from "@toss/tds-mobile";
import { SectionCard } from "../../../components/shared/Surface";
import type { SessionResult } from "../../../types";

interface TodaySummaryCardProps {
  sessions: SessionResult[];
}

export function TodaySummaryCard({ sessions }: TodaySummaryCardProps) {
  const totalHits = sessions.reduce((sum, session) => sum + session.hits, 0);
  const totalReleased = sessions.reduce(
    (sum, session) => sum + Math.max(0, session.angerBefore - session.angerAfter),
    0,
  );
  const latestSession = sessions[0];

  return (
    <SectionCard css={{ background: "#ffffff" }}>
      <div>
        <Text as="h3" typography="t4" fontWeight="bold" css={{ color: "#35214f" }}>
          오늘 기록
        </Text>
      </div>
      {sessions.length > 0 ? (
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            marginTop: 14,
          }}
        >
          <div css={{ padding: 14, borderRadius: 18, background: "#f3fff8" }}>
            <div>
              <Text as="div" typography="t7" css={{ color: "#6a5b7f" }}>
                오늘 세션
              </Text>
            </div>
            <div css={{ marginTop: 4 }}>
              <Text as="div" typography="t3" fontWeight="bold" css={{ color: "#35214f" }}>
                {sessions.length}회
              </Text>
            </div>
          </div>
          <div css={{ padding: 14, borderRadius: 18, background: "#f3fff8" }}>
            <div>
              <Text as="div" typography="t7" css={{ color: "#6a5b7f" }}>
                총 타격 수
              </Text>
            </div>
            <div css={{ marginTop: 4 }}>
              <Text as="div" typography="t3" fontWeight="bold" css={{ color: "#35214f" }}>
                {totalHits}
              </Text>
            </div>
          </div>
          <div css={{ padding: 14, borderRadius: 18, background: "#f3fff8" }}>
            <div>
              <Text as="div" typography="t7" css={{ color: "#6a5b7f" }}>
                가장 최근 대상
              </Text>
            </div>
            <div css={{ marginTop: 4 }}>
              <Text as="div" typography="t5" fontWeight="bold" css={{ color: "#35214f" }}>
                {latestSession ? latestSession.customTarget?.trim() || latestSession.nickname.trim() || latestSession.target : "-"}
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div css={{ marginTop: 10 }}>
          <Text as="p" typography="t7" css={{ color: "#6a5b7f" }}>
            오늘은 아직 꺼내놓은 감정이 없어요. 필요할 때 바로 시작해도 괜찮아요.
          </Text>
        </div>
      )}

      {sessions.length > 0 ? (
        <div css={{ marginTop: 12 }}>
          <Text as="p" typography="t7" css={{ color: "#5e4d75" }}>
            오늘 {totalReleased}만큼 덜어냈고, 가장 최근엔{" "}
            <b>{latestSession?.customTarget?.trim() || latestSession?.nickname.trim() || latestSession?.target}</b>
            {` `}
            때문에 기록했어요.
          </Text>
        </div>
      ) : null}
    </SectionCard>
  );
}
