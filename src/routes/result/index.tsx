import { colors } from "@toss/tds-colors";
import { FixedBottomCTA, Text } from "@toss/tds-mobile";
import { Navigate, useNavigate } from "react-router-dom";
import { MascotHero } from "../../components/shared/MascotHero";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
  SectionCard,
  StatCard,
  StatsGrid,
} from "../../components/shared/Surface";
import { formatSessionLabel } from "../../lib/storage";
import { useAppState } from "../../state/AppState";
import { BottomCTA } from "../../components/shared/BottomCTA";

export function ResultRoute() {
  const navigate = useNavigate();
  const { lastResult, resetDraft } = useAppState();

  if (!lastResult) {
    return <Navigate replace to="/" />;
  }

  function goHome() {
    resetDraft();
    navigate("/home");
  }

  function playAgain() {
    resetDraft();
    navigate("/start/target");
  }

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle={`${lastResult.angerBefore}에서 ${lastResult.angerAfter}까지 내려왔어요.`}
            title={"참느라\n고생했어요."}
          />

          <StatsGrid>
            <StatCard>
              <Text
                as="span"
                typography="t7"
                css={{ display: "block", color: colors.grey600 }}
              >
                타격 수
              </Text>
              <strong css={{ fontSize: 30, color: colors.red500 }}>
                {lastResult.hits}
              </strong>
            </StatCard>
            <StatCard>
              <Text
                as="span"
                typography="t7"
                css={{ display: "block", color: colors.grey600 }}
              >
                특수 스킬
              </Text>
              <strong css={{ fontSize: 30, color: colors.purple600 }}>
                {lastResult.skillShots}
              </strong>
            </StatCard>
            <StatCard>
              <Text
                as="span"
                typography="t7"
                css={{ display: "block", color: colors.grey600 }}
              >
                배출률
              </Text>
              <strong css={{ fontSize: 30, color: colors.yellow700 }}>
                {lastResult.releasedPercent}%
              </strong>
            </StatCard>
            <StatCard>
              <Text
                as="span"
                typography="t7"
                css={{ display: "block", color: colors.grey600 }}
              >
                포인트
              </Text>
              <strong css={{ fontSize: 30, color: colors.blue500 }}>
                {lastResult.points}P
              </strong>
            </StatCard>
          </StatsGrid>

          <SectionCard>
            <Text
              as="div"
              typography="t6"
              fontWeight="bold"
              css={{ marginBottom: 12 }}
            >
              {formatSessionLabel(lastResult)}
            </Text>
            <Text
              as="div"
              typography="t6"
              css={{ margin: 0, color: colors.grey600 }}
            >
              {lastResult.memo || "이번 기록에는 별도 메모를 남기지 않았어요."}
            </Text>
          </SectionCard>
        </BodyStack>
      </ScreenPanel>

      <BottomCTA
        bottomAccessory={
          <button
            type="button"
            onClick={playAgain}
            css={{
              border: 0,
              background: "transparent",
              color: colors.grey700,
              fontSize: 15,
              fontWeight: 600,
              padding: 0,
            }}
          >
            한 판 더
          </button>
        }
        onClick={goHome}
      >
        홈으로
      </BottomCTA>
    </AppShell>
  );
}
