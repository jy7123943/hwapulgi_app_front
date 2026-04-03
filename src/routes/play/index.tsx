import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { colors } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { Navigate, useNavigate } from "react-router-dom";
import { LOADING_MESSAGES } from "../../constants";
import { useAppState } from "../../state/AppState";
import { safeHaptic } from "../../lib/haptics";
import { GameActions } from "./components/GameActions";
import { GameMetrics } from "./components/GameMetrics";
import { useGameSession } from "./useGameSession";

const GameArena = lazy(() =>
  import("../../components/GameArena").then((module) => ({
    default: module.GameArena,
  }))
);

export function GameRoute() {
  const navigate = useNavigate();
  const { draft, completeSession } = useAppState();
  const {
    angerGaugePercent,
    currentAnger,
    handleGameHit,
    hits,
    muted,
    sessionKey,
    taunt,
    setGameController,
    setMuted,
    stopTauntRotation,
  } = useGameSession({ angerBefore: draft.angerBefore });
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [showEndingOverlay, setShowEndingOverlay] = useState(false);
  const hasFinishedRef = useRef(false);
  const endingTimeoutRef = useRef<number | null>(null);

  const loadingMessage = useMemo(() => {
    const seed = sessionKey
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return LOADING_MESSAGES[seed % LOADING_MESSAGES.length];
  }, [sessionKey]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMinLoadingDone(true);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      if (endingTimeoutRef.current !== null) {
        window.clearTimeout(endingTimeoutRef.current);
      }
    };
  }, []);

  if (!draft.nickname.trim()) {
    return <Navigate replace to="/start/name" />;
  }

  function finishGame() {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
    stopTauntRotation();
    completeSession({
      hits,
      skillShots: 0,
      angerAfter: Math.min(currentAnger, draft.angerBefore),
    });
    void safeHaptic("success");
    navigate("/result");
  }

  function finishGameWithOverlay() {
    if (hasFinishedRef.current || showEndingOverlay) {
      return;
    }

    setShowEndingOverlay(true);
    void safeHaptic("success");
    endingTimeoutRef.current = window.setTimeout(() => {
      finishGame();
    }, 2800);
  }

  useEffect(() => {
    if (hits > 0 && currentAnger <= 0) {
      finishGameWithOverlay();
    }
  }, [currentAnger, hits]);

  return (
    <div
      css={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top, rgba(177, 122, 255, 0.22), transparent 30%), linear-gradient(180deg, #2a2148 0%, #392b61 62%, #2d224f 100%)",
        padding: "14px 14px 18px",
        gap: 10,
        overflow: "hidden",
      }}
    >
      <GameMetrics angerGaugePercent={angerGaugePercent} hits={hits} />

      <div
        css={{
          borderRadius: 22,
          padding: "14px 16px",
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 10px 26px rgba(4, 10, 22, 0.22)",
        }}
      >
        <div
          css={{
            color: colors.grey600,
            fontSize: 15,
          }}
        >
          {taunt}
        </div>
      </div>

      <div
        css={{
          position: "relative",
          flex: 1,
          minHeight: 420,
          width: "100%",
        }}
      >
        {minLoadingDone ? (
          <Suspense
            fallback={
              <div
                css={{
                  display: "grid",
                  placeItems: "center",
                  position: "absolute",
                  inset: 0,
                  borderRadius: 28,
                  color: colors.background,
                  background: "#392b61",
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    padding: "24px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    css={{
                      width: 88,
                      height: 88,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.08)",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "0 14px 30px rgba(18, 8, 42, 0.18)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt=""
                      src={`${import.meta.env.BASE_URL}angryface.png`}
                      css={{
                        width: 72,
                        height: 72,
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                  <Text
                    typography="t4"
                    fontWeight="bold"
                    css={{ color: colors.background }}
                  >
                    화력 충전 중...
                  </Text>
                  <Text
                    typography="t7"
                    fontWeight="medium"
                    css={{ color: colors.grey100 }}
                  >
                    {loadingMessage}
                  </Text>
                </div>
              </div>
            }
          >
            <GameArena
              initialAnger={draft.angerBefore}
              nickname={draft.nickname}
              onHit={handleGameHit}
              onReady={(controller) => setGameController(controller)}
              sessionKey={sessionKey}
            />
          </Suspense>
        ) : (
          <div
            css={{
              display: "grid",
              placeItems: "center",
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              color: colors.background,
              background: "#392b61",
            }}
          >
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
                  <div
                    css={{
                      width: 88,
                      height: 88,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.08)",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "0 14px 30px rgba(18, 8, 42, 0.18)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt=""
                      src={`${import.meta.env.BASE_URL}angryface.png`}
                      css={{
                        width: 72,
                        height: 72,
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
              <Text
                typography="t4"
                fontWeight="bold"
                css={{ color: colors.background }}
              >
                화력 충전 중...
              </Text>
              <Text
                typography="t7"
                fontWeight="medium"
                css={{ color: colors.grey100 }}
              >
                {loadingMessage}
              </Text>
            </div>
          </div>
        )}

        {showEndingOverlay ? (
          <div
            css={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              display: "grid",
              placeItems: "center",
              background: "rgba(25, 17, 46, 0.72)",
              backdropFilter: "blur(10px)",
              borderRadius: 28,
              padding: 24,
              textAlign: "center",
            }}
          >
            <button
              type="button"
              aria-label="결과 보기"
              onClick={finishGame}
              css={{
                position: "absolute",
                top: 18,
                right: 18,
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.12)",
                color: colors.background,
                display: "grid",
                placeItems: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <Asset.Icon
                aria-hidden={true}
                color={colors.background}
                frameShape={Asset.frameShape.CleanWFull}
                name="icon-x-mono"
              />
            </button>
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img
                alt=""
                src={`${import.meta.env.BASE_URL}happyface.png`}
                css={{
                  width: 92,
                  height: 92,
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <Text
                typography="t3"
                fontWeight="bold"
                css={{ color: colors.background }}
              >
                배출 완료!
              </Text>
              <Text
                typography="t6"
                fontWeight="medium"
                css={{ color: colors.grey100 }}
              >
                건강하게 끝까지 해소해낸 당신, 정말 멋져요.
              </Text>
            </div>
          </div>
        ) : null}

        <GameActions
          muted={muted}
          onFinish={finishGame}
          onToggleMute={() => setMuted((prev) => !prev)}
        />
      </div>
    </div>
  );
}
