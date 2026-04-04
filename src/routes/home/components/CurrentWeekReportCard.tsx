import { useMemo, useState } from "react";
import { colors } from "@toss/tds-colors";
import { Button, Text } from "@toss/tds-mobile";
import { SectionCard } from "../../../components/shared/Surface";
import { formatSessionLabel } from "../../../lib/storage";
import type { WeeklySummary } from "../../../types";

interface CurrentWeekReportCardProps {
  weeklySummary: WeeklySummary;
  onOpen?: () => void;
}

function getBarColor(angerLevel: number) {
  if (angerLevel <= 20) {
    return colors.blue100;
  }

  if (angerLevel <= 60) {
    return colors.yellow200;
  }

  if (angerLevel <= 80) {
    return "#ffd6c9";
  }

  return "#f7b3d0";
}

export function CurrentWeekReportCard({
  weeklySummary,
  onOpen,
}: CurrentWeekReportCardProps) {
  const firstActiveDateKey = weeklySummary.calendarDays.find(
    (day) => day.sessions.length > 0,
  )?.dateKey;
  const [selectedDateKey, setSelectedDateKey] = useState(
    firstActiveDateKey ?? weeklySummary.calendarDays[6]?.dateKey ?? "",
  );

  const selectedDay = useMemo(
    () =>
      weeklySummary.calendarDays.find(
        (day) => day.dateKey === selectedDateKey,
      ) ?? weeklySummary.calendarDays[6],
    [selectedDateKey, weeklySummary.calendarDays],
  );
  const selectedSession = selectedDay?.sessions[0];

  return (
    <SectionCard css={{ background: "#ffffff" }}>
      <Text
        as="h3"
        typography="t6"
        fontWeight="bold"
        css={{ color: colors.grey900 }}
      >
        이번 주 감정 흐름
      </Text>
      <Text
        as="p"
        typography="t7"
        css={{ color: colors.grey700, marginTop: 8 }}
      >
        이번 주 {weeklySummary.totalSessions}일 기록했고, 가장 많이 화난 대상은{" "}
        {weeklySummary.topTargets[0]?.label ?? "-"}이에요.
      </Text>
      <Text
        as="p"
        typography="t7"
        css={{ color: colors.grey700, marginTop: 4 }}
      >
        가장 힘들었던 요일은 {weeklySummary.hardestWeekday}였어요.
      </Text>

      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 10,
          marginTop: 18,
          alignItems: "end",
        }}
      >
        {weeklySummary.calendarDays.map((day) => (
          <button
            key={day.dateKey}
            type="button"
            onClick={() => setSelectedDateKey(day.dateKey)}
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "transparent",
              border: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <div
              css={{
                width: "100%",
                maxWidth: 32,
                height: 116,
                borderRadius: 999,
                background: colors.grey100,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "stretch",
                overflow: "hidden",
              }}
            >
              <div
                css={{
                  width: "100%",
                  minHeight: day.sessions.length > 0 ? 12 : 8,
                  height: `${Math.max(day.angerLevel, day.sessions.length > 0 ? 14 : 8)}%`,
                  borderRadius: 999,
                  background:
                    day.sessions.length > 0
                      ? getBarColor(day.angerLevel)
                      : colors.grey200,
                  transition: "height 180ms ease",
                }}
              />
            </div>
            <div
              css={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text
                as="div"
                typography="t7"
                css={{
                  color:
                    day.dateKey === selectedDateKey
                      ? colors.grey900
                      : colors.grey400,
                }}
              >
                {day.dayLabel}
              </Text>
              <Text
                as="div"
                typography="t6"
                fontWeight="bold"
                css={{
                  color:
                    day.dateKey === selectedDateKey
                      ? colors.grey900
                      : colors.grey500,
                  marginTop: 2,
                }}
              >
                {day.dayNumber}
              </Text>
            </div>
          </button>
        ))}
      </div>

      <div
        css={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14,
        }}
      >
        {[
          ["스트레스", colors.yellow200],
          ["화남", "#ffd6c9"],
          ["폭발", "#f7b3d0"],
        ].map(([label, color]) => (
          <div
            key={label}
            css={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              background: colors.grey50,
            }}
          >
            <span
              css={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: color,
              }}
            />
            <Text as="span" typography="t7" css={{ color: colors.grey700 }}>
              {label}
            </Text>
          </div>
        ))}
      </div>

      <div
        css={{
          marginTop: 14,
          borderRadius: 22,
          padding: 16,
          background: colors.grey50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text
          as="div"
          typography="t7"
          fontWeight="bold"
          css={{ color: colors.grey900 }}
        >
          {selectedDay
            ? `${new Date(selectedDay.dateKey).getMonth() + 1}월 ${new Date(selectedDay.dateKey).getDate()}일`
            : "기록 상세"}
        </Text>

        {selectedSession ? (
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 10,
            }}
          >
            <Text as="div" typography="t7" css={{ color: colors.grey700 }}>
              분노 유발자: {formatSessionLabel(selectedSession)}
            </Text>
            <Text as="div" typography="t7" css={{ color: colors.grey700 }}>
              분노 게이지: {selectedSession.angerBefore} →{" "}
              {selectedSession.angerAfter}
            </Text>
            <Text as="div" typography="t7" css={{ color: colors.grey700 }}>
              타격 수: {selectedSession.hits}
            </Text>
            <Text as="div" typography="t7" css={{ color: colors.grey700 }}>
              메모: {selectedSession.memo || "남긴 메모가 없어요."}
            </Text>
          </div>
        ) : (
          <Text
            as="p"
            typography="t7"
            css={{ color: colors.grey500, marginTop: 10 }}
          >
            이 날은 기록이 없어요.
          </Text>
        )}
      </div>

      {onOpen ? (
        <Button
          color="primary"
          display="block"
          onClick={onOpen}
          size="large"
          css={{ marginTop: 16 }}
        >
          이번 주 정리 보기
        </Button>
      ) : null}
    </SectionCard>
  );
}
