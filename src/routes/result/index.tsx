import { useState } from "react";
import { colors } from "@toss/tds-colors";
import { Slider, Text } from "@toss/tds-mobile";
import { Navigate, useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
  SectionCard,
  StatsGrid,
} from "../../components/shared/Surface";
import { useAppState } from "../../state/AppState";
import { BottomCTA } from "../../components/shared/BottomCTA";
import { ResultStatCard } from "./components/ResultStatCard";
import { ScreenHeading } from "../../components/shared/ScreenHeading";

export function ResultRoute() {
  const navigate = useNavigate();
  const {
    lastResult,
    resetDraft,
    updateLastResultAngerAfter,
    updateLastResultMemo,
  } = useAppState();
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState("");
  const [memoSaving, setMemoSaving] = useState(false);

  if (!lastResult) {
    return <Navigate replace to="/" />;
  }

  function startEditMemo() {
    setMemoDraft(lastResult?.memo ?? "");
    setIsEditingMemo(true);
  }

  async function saveMemo() {
    setMemoSaving(true);
    try {
      await updateLastResultMemo(memoDraft);
      setIsEditingMemo(false);
    } finally {
      setMemoSaving(false);
    }
  }

  function goHome() {
    resetDraft();
    navigate("/home");
  }

  const angerDeltaPercent = Math.round(
    Math.abs(lastResult.angerBefore - lastResult.angerAfter),
  );
  const angerSummaryText =
    lastResult.angerAfter < lastResult.angerBefore
      ? `${angerDeltaPercent}% 분노가 감소했어요.`
      : lastResult.angerAfter > lastResult.angerBefore
        ? `${angerDeltaPercent}% 분노가 늘었어요.`
        : "분노 게이지가 그대로예요.";

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <ScreenHeading
            subtitle={angerSummaryText}
            title={"오늘 화,\n잘 풀어냈어요."}
          />

          <StatsGrid>
            <ResultStatCard
              label="타격 수"
              value={lastResult.hits}
              valueColor={colors.red500}
            />
            <ResultStatCard
              label="분노 게이지"
              value={lastResult.angerAfter}
              valueColor="#4cc49b"
            />
          </StatsGrid>

          <div
            css={{
              background: "#f3fff8",
              boxShadow: "none",
              borderRadius: 28,
              padding: 20,
              paddingTop: 26,
            }}
          >
            <Text
              as="div"
              typography="t6"
              fontWeight="bold"
              css={{ marginBottom: 6, color: colors.grey900 }}
            >
              지금의 분노 게이지
            </Text>
            <Text
              as="div"
              typography="t7"
              css={{ marginBottom: 8, color: colors.grey600 }}
            >
              게임을 마친 지금 기분에 맞게 다시 조절해 주세요.
            </Text>
            <Text
              as="div"
              typography="t2"
              fontWeight="bold"
              css={{ marginBottom: 16, color: "#4cc49b" }}
            >
              {lastResult.angerAfter} / 100
            </Text>
            <Slider
              color="#c74a32"
              label={{ min: "괜찮음", mid: "빡침", max: "폭발 직전" }}
              max={100}
              min={0}
              onValueChange={updateLastResultAngerAfter}
              value={lastResult.angerAfter}
            />
          </div>

          <SectionCard>
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                as="div"
                typography="t6"
                fontWeight="bold"
                css={{ color: colors.grey900 }}
              >
                이번 기록 메모
              </Text>
              {!isEditingMemo && (
                <button
                  type="button"
                  onClick={startEditMemo}
                  css={{
                    border: "2px solid #4e356d",
                    borderRadius: 999,
                    background: "#fff4df",
                    color: "#35214f",
                    padding: "4px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {lastResult.memo ? "수정" : "추가"}
                </button>
              )}
            </div>
            {isEditingMemo ? (
              <div css={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={memoDraft}
                  onChange={(e) => setMemoDraft(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="오늘 어떤 화였는지 짧게 남겨보세요."
                  css={{
                    width: "100%",
                    border: "2px solid #4e356d",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 15,
                    lineHeight: 1.5,
                    background: "#fffef9",
                    color: colors.grey900,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div css={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingMemo(false)}
                    disabled={memoSaving}
                    css={{
                      border: "2px solid #4e356d",
                      borderRadius: 999,
                      background: "transparent",
                      color: colors.grey700,
                      padding: "8px 16px",
                      fontWeight: 700,
                      cursor: memoSaving ? "not-allowed" : "pointer",
                      opacity: memoSaving ? 0.6 : 1,
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={saveMemo}
                    disabled={memoSaving}
                    css={{
                      border: "2px solid #4e356d",
                      borderRadius: 999,
                      background: "#bff4d5",
                      color: "#35214f",
                      padding: "8px 16px",
                      fontWeight: 700,
                      cursor: memoSaving ? "not-allowed" : "pointer",
                      opacity: memoSaving ? 0.6 : 1,
                    }}
                  >
                    {memoSaving ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>
            ) : (
              <Text
                as="div"
                typography="t6"
                css={{
                  color: colors.grey700,
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {lastResult.memo || "이번 기록에는 별도 메모를 남기지 않았어요."}
              </Text>
            )}
          </SectionCard>
        </BodyStack>
      </ScreenPanel>

      <BottomCTA onClick={goHome}>홈으로</BottomCTA>
    </AppShell>
  );
}
