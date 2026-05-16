import { useEffect, useState } from "react";
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
import { isRewardedAdReady, preloadRewardedAd, showRewardedAd } from "../../lib/ad";

export function ResultRoute() {
  const navigate = useNavigate();
  const { lastResult, resetDraft, updateLastResultAngerAfter } = useAppState();
  const [adRewarded, setAdRewarded] = useState(false);

  useEffect(() => {
    preloadRewardedAd();
  }, []);

  if (!lastResult) {
    return <Navigate replace to="/" />;
  }

  async function handleWatchAd() {
    const { rewarded } = await showRewardedAd();
    if (rewarded) {
      setAdRewarded(true);
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
            <div css={{ marginBottom: 12 }}>
              <Text
                as="div"
                typography="t6"
                fontWeight="bold"
                css={{ color: colors.grey900 }}
              >
                이번 기록 메모
              </Text>
            </div>
            <div>
              <Text
                as="div"
                typography="t6"
                css={{
                  color: colors.grey700,
                  wordBreak: "break-word",
                }}
              >
                {lastResult.memo || "이번 기록에는 별도 메모를 남기지 않았어요."}
              </Text>
            </div>
          </SectionCard>

          {isRewardedAdReady() && !adRewarded && (
            <button
              type="button"
              onClick={handleWatchAd}
              css={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <Text typography="t6" fontWeight="bold" css={{ color: "#fff" }}>
                광고 보고 보너스 받기
              </Text>
            </button>
          )}
          {adRewarded && (
            <div
              css={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: 16,
                background: "#f3fff8",
                textAlign: "center",
              }}
            >
              <Text typography="t6" fontWeight="bold" css={{ color: "#4cc49b" }}>
                보너스 획득 완료!
              </Text>
            </div>
          )}
        </BodyStack>
      </ScreenPanel>

      <BottomCTA onClick={goHome}>홈으로</BottomCTA>
    </AppShell>
  );
}
