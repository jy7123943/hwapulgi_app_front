import { Text } from "@toss/tds-mobile";
import { SectionCard } from "../../../components/shared/Surface";
import { formatSessionLabel } from "../../../lib/storage";
import type { SessionResult } from "../../../types";

interface RecentListProps {
  sessions: SessionResult[];
}

function formatSessionDateTime(createdAt: string) {
  const date = new Date(createdAt);
  const hours = date.getHours();
  const period = hours >= 12 ? "pm" : "am";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(displayHour).padStart(2, "0")}${period}`;
}

export function RecentList({ sessions }: RecentListProps) {
  return (
    <SectionCard css={{ background: "#ffffff" }}>
      <Text
        as="div"
        typography="t4"
        fontWeight="bold"
        css={{ marginBottom: 12, color: "#35214f" }}
      >
        오늘 있었던 액션
      </Text>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <article
              key={session.id}
              css={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                padding: 16,
                borderRadius: 18,
                background: "#f3fff8",
              }}
            >
              <div>
                <strong css={{ display: "block", marginBottom: 4, color: "#35214f" }}>
                  {formatSessionLabel(session)}
                </strong>
                <p css={{ margin: 0, color: "#6a5b7f" }}>
                  {session.hits} hits · 분노 {session.angerBefore} →{" "}
                  {session.angerAfter}
                </p>
                <Text
                  as="div"
                  typography="t7"
                  css={{ color: "#8f82a4", marginTop: 6 }}
                >
                  {formatSessionDateTime(session.createdAt)}
                </Text>
              </div>
            </article>
          ))
        ) : (
          <Text as="p" typography="t7" css={{ color: "#6a5b7f" }}>
            오늘은 아직 기록된 액션이 없어요.
          </Text>
        )}
      </div>
    </SectionCard>
  );
}
