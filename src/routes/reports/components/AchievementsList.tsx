import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { SectionCard } from "../../../components/shared/Surface";
import { useMyAchievements } from "../../../lib/queries/achievement";

function formatAchievedAt(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export function AchievementsList() {
  const { data: achievements = [], isLoading } = useMyAchievements();

  return (
    <SectionCard css={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Text
        as="h3"
        typography="t6"
        fontWeight="bold"
        css={{ color: colors.grey900 }}
      >
        획득한 업적
      </Text>
      {isLoading ? (
        <Text typography="t7" css={{ color: colors.grey500 }}>
          불러오는 중...
        </Text>
      ) : achievements.length === 0 ? (
        <Text typography="t7" css={{ color: colors.grey500 }}>
          아직 업적이 없어요. 화 한 번 풀면 첫 업적이 시작돼요.
        </Text>
      ) : (
        <div css={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {achievements.map((achievement) => (
            <div
              key={`${achievement.type}-${achievement.achievedAt}`}
              css={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
                padding: "10px 12px",
                background: "#f3fff8",
                borderRadius: 16,
              }}
            >
              <div>
                <Text
                  typography="t6"
                  fontWeight="bold"
                  css={{ color: colors.grey900 }}
                >
                  {achievement.title}
                </Text>
                <Text typography="t8" css={{ color: colors.grey600 }}>
                  {achievement.description}
                </Text>
              </div>
              <Text typography="t8" css={{ color: colors.grey500 }}>
                {formatAchievedAt(achievement.achievedAt)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
