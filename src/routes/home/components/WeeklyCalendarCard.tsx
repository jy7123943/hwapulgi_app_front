import { useMemo, useState } from "react";
import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { SectionCard } from "../../../components/shared/Surface";
import { formatSessionLabel } from "../../../lib/storage";
import type { WeeklySummary } from "../../../types";

interface WeeklyCalendarCardProps {
  weeklySummary: WeeklySummary;
}

function getAngerTone(angerLevel: number) {
  if (angerLevel <= 0) {
    return {
      background: "rgba(255,255,255,0.7)",
      border: "none",
      text: colors.grey500,
    };
  }

  if (angerLevel <= 40) {
    return { background: "#e6deff", border: "none", text: "#7a5cc1" };
  }

  if (angerLevel <= 60) {
    return { background: "#fff0b8", border: "none", text: "#a27000" };
  }

  if (angerLevel <= 80) {
    return { background: "#ffd7c9", border: "none", text: "#bf6450" };
  }

  return { background: "#ffc6d9", border: "none", text: "#c04d7c" };
}

export function WeeklyCalendarCard({ weeklySummary }: WeeklyCalendarCardProps) {
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
    <SectionCard
      css={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Text
        as="h3"
        typography="t6"
        fontWeight="bold"
        css={{ color: colors.grey900 }}
      >
        이번 주 감정 캘린더
      </Text>
      <Text as="p" typography="t7" css={{ color: colors.grey500 }}>
        화를 꺼낸 날이 쌓일수록 내 패턴이 보여요.
      </Text>

      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 8,
          marginTop: 16,
        }}
      >
        {weeklySummary.calendarDays.map((day) => {
          const tone = getAngerTone(day.angerLevel);

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => setSelectedDateKey(day.dateKey)}
              css={{
                borderRadius: 18,
                border: "none",
                background: tone.background,
                padding: "12px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                minHeight: 86,
                boxShadow: "none",
              }}
            >
              <Text as="span" typography="t7" css={{ color: colors.grey600 }}>
                {day.dayLabel}
              </Text>
              <Text
                as="span"
                typography="t6"
                fontWeight="bold"
                css={{ color: tone.text }}
              >
                {day.dayNumber}
              </Text>
              <div
                css={{
                  width: 10,
                  height: 10,
                  borderRadius: "999px",
                  background:
                    day.sessions.length > 0
                      ? tone.text
                      : "rgba(120, 120, 120, 0.18)",
                }}
              />
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
        {[
          ["평온", "#e6deff"],
          ["스트레스", "#fff0b8"],
          ["화남", "#ffd7c9"],
          ["폭발", "#ffc6d9"],
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
          marginTop: 16,
          borderRadius: 22,
          padding: 16,
          background: colors.grey50,
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
              대상: {formatSessionLabel(selectedSession)}
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
    </SectionCard>
  );
}
