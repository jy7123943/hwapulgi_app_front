import { colors } from "@toss/tds-colors";
import { Slider, Text } from "@toss/tds-mobile";
import { Navigate, useNavigate } from "react-router-dom";
import { MascotHero } from "../../components/shared/MascotHero";
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

export function ResultRoute() {
  const navigate = useNavigate();
  const { lastResult, resetDraft, updateLastResultAngerAfter } = useAppState();

  if (!lastResult) {
    return <Navigate replace to="/" />;
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
          <MascotHero
            type="happy"
            subtitle={angerSummaryText}
            title={"참느라\n고생했어요."}
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
              valueColor={colors.yellow700}
            />
          </StatsGrid>

          <div
            css={{
              background: "#fff6e6",
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
              css={{ marginBottom: 16, color: colors.yellow700 }}
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
            <Text
              as="div"
              typography="t6"
              fontWeight="bold"
              css={{ display: "block", marginBottom: 12 }}
            >
              이번 기록 메모
            </Text>
            <Text
              as="div"
              typography="t6"
              css={{
                display: "block",
                margin: 0,
                color: colors.grey600,
                wordBreak: "break-word",
              }}
            >
              {lastResult.memo || "이번 기록에는 별도 메모를 남기지 않았어요."}
            </Text>
          </SectionCard>
        </BodyStack>
      </ScreenPanel>

      <BottomCTA onClick={goHome}>홈으로</BottomCTA>
    </AppShell>
  );
}
