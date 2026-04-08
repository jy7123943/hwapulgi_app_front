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

const GRAPH_SEGMENTS = [
  { label: "스트레스", max: 40, color: "#b9f0d8" },
  { label: "화남", max: 70, color: "#9ec5ff" },
  { label: "폭발", max: 100, color: "#ff8fbd" },
] as const;

function getBarColor(angerLevel: number) {
  if (angerLevel <= 40) {
    return GRAPH_SEGMENTS[0].color;
  }

  if (angerLevel <= 70) {
    return GRAPH_SEGMENTS[1].color;
  }

  return GRAPH_SEGMENTS[2].color;
}

function getDayDisplayHeight(angerLevel: number, hasSessions: boolean) {
  if (!hasSessions) {
    return 10;
  }

  return Math.max(18, angerLevel);
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
      <div>
        <Text
          as="h3"
          typography="t4"
          fontWeight="bold"
          css={{ color: "#35214f" }}
        >
          이번 주 감정 흐름
        </Text>
      </div>
      <div css={{ marginTop: 8 }}>
        <Text
          as="p"
          typography="t7"
          css={{ color: "#6a5b7f" }}
        >
          이번 주 {weeklySummary.totalSessions}일 기록했고, 가장 많이 화난 대상은{" "}
          {weeklySummary.topTargets[0]?.label ?? "-"}이에요.
        </Text>
      </div>
      <div css={{ marginTop: 4 }}>
        <Text
          as="p"
          typography="t7"
          css={{ color: "#6a5b7f" }}
        >
          가장 힘들었던 요일은 {weeklySummary.hardestWeekday}였어요.
        </Text>
      </div>

      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 10,
          alignItems: "end",
          marginTop: 18,
          position: "relative",
        }}
      >
        <div
          css={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 56,
            height: 2,
            background: "#e9e0f3",
          }}
        />
        {weeklySummary.calendarDays.map((day) => {
          const totalHeight = getDayDisplayHeight(
            day.angerLevel,
            day.sessions.length > 0,
          );

          return (
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
                  maxWidth: 38,
                  height: 124,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  css={{
                    width: 30,
                    height: totalHeight,
                    minHeight: day.sessions.length > 0 ? 22 : 12,
                    borderRadius: "16px 16px 14px 14px",
                    border: "3px solid #4e356d",
                    background:
                      day.sessions.length > 0
                        ? getBarColor(day.angerLevel)
                        : "#ede6f6",
                    overflow: "hidden",
                    boxShadow: "0 4px 0 rgba(78, 53, 109, 0.1)",
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
                  typography="t6"
                  css={{
                    color:
                      day.dateKey === selectedDateKey
                        ? colors.grey900
                        : "#9d91b1",
                  }}
                >
                  {day.dayLabel}
                </Text>
                <Text
                  as="div"
                  typography="t5"
                  fontWeight="bold"
                  css={{
                    color:
                      day.dateKey === selectedDateKey
                        ? colors.grey900
                        : "#7c6e93",
                    marginTop: 2,
                  }}
                >
                  {day.dayNumber}
                </Text>
              </div>
            </button>
          );
        })}
      </div>

      <div
        css={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14,
        }}
      >
        {GRAPH_SEGMENTS.map(({ label, color }) => (
          <div
            key={label}
            css={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              background: "#f3fff8",
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
            <Text as="span" typography="t7" css={{ color: "#65567e" }}>
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
          background: "#f3fff8",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text
          as="div"
          typography="t6"
          fontWeight="bold"
          css={{ color: "#35214f" }}
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
            <Text as="div" typography="t7" css={{ color: "#4f4766" }}>
              분노 유발자: {formatSessionLabel(selectedSession)}
            </Text>
            <Text as="div" typography="t7" css={{ color: "#4f4766" }}>
              분노 게이지: {selectedSession.angerBefore} →{" "}
              {selectedSession.angerAfter}
            </Text>
            <Text as="div" typography="t7" css={{ color: "#4f4766" }}>
              타격 수: {selectedSession.hits}
            </Text>
            <Text as="div" typography="t7" css={{ color: "#4f4766" }}>
              메모: {selectedSession.memo || "남긴 메모가 없어요."}
            </Text>
          </div>
        ) : (
          <Text
            as="p"
            typography="t7"
            css={{ color: "#8f82a4", marginTop: 10 }}
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
