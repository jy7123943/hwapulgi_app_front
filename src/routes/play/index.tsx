import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { colors } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { Navigate, useNavigate } from "react-router-dom";
import { LOADING_MESSAGES, START_GUIDE_STORAGE_KEY } from "../../constants";
import { useAppState } from "../../state/AppState";
import { safeHaptic } from "../../lib/haptics";
import { GameActions } from "./components/GameActions";
import { GameMetrics } from "./components/GameMetrics";
import { useGameSession } from "./useGameSession";

const GameArena = lazy(() =>
  import("../../components/GameArena").then((module) => ({
    default: module.GameArena,
  })),
);

export function GameRoute() {
  const navigate = useNavigate();
  const { draft, completeSession } = useAppState();
  const {
    angerGaugePercent,
    currentAnger,
    handleGameHit,
    hapticsMuted,
    hits,
    muted,
    sessionKey,
    taunt,
    setHapticsMuted,
    setMuted,
  } = useGameSession({ angerBefore: draft.angerBefore });
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [showStartGuide, setShowStartGuide] = useState(false);
  const [showEndingOverlay, setShowEndingOverlay] = useState(false);
  const hasFinishedRef = useRef(false);
  const endingTimeoutRef = useRef<number | null>(null);
  const startGuideTimeoutRef = useRef<number | null>(null);

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
      if (startGuideTimeoutRef.current !== null) {
        window.clearTimeout(startGuideTimeoutRef.current);
      }
    };
  }, []);

  if (!draft.nickname.trim() || !draft.gender) {
    return <Navigate replace to="/start/name" />;
  }

  function finishGame() {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
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
      const timeout = window.setTimeout(() => {
        finishGameWithOverlay();
      }, 2200);

      return () => window.clearTimeout(timeout);
    }
  }, [currentAnger, hits]);

  useEffect(() => {
    if (!minLoadingDone) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem(START_GUIDE_STORAGE_KEY) === "true") {
      return;
    }

    startGuideTimeoutRef.current = window.setTimeout(() => {
      setShowStartGuide(true);
      window.localStorage.setItem(START_GUIDE_STORAGE_KEY, "true");
    }, 260);

    return () => {
      if (startGuideTimeoutRef.current !== null) {
        window.clearTimeout(startGuideTimeoutRef.current);
        startGuideTimeoutRef.current = null;
      }
    };
  }, [minLoadingDone]);

  useEffect(() => {
    if (hits > 0) {
      setShowStartGuide(false);
    }
  }, [hits]);

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
                      boxShadow: "none",
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
              gender={draft.gender}
              initialAnger={draft.angerBefore}
              muted={muted}
              nickname={draft.nickname}
              onHit={handleGameHit}
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
                  boxShadow: "none",
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

        {minLoadingDone && showStartGuide && !showEndingOverlay ? (
          <div
            css={{
              position: "absolute",
              left: 20,
              right: 20,
              top: "58%",
              transform: "translateY(-50%)",
              zIndex: 3,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              css={{
                maxWidth: 280,
                borderRadius: 20,
                padding: "16px 18px",
                background: "rgba(23, 16, 42, 0.62)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 12px 28px rgba(10, 6, 20, 0.22)",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Text
                typography="t6"
                fontWeight="bold"
                css={{ color: "#ffffff" }}
              >
                캐릭터를 터치해서 때려보세요.
              </Text>
              <Text
                typography="t7"
                fontWeight="medium"
                css={{
                  color: "rgba(255,255,255,0.92)",
                  marginTop: 8,
                }}
              >
                마음 가는 대로 두들겨보아요.
              </Text>
            </div>
          </div>
        ) : null}

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
                border: "none",
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
                분노 격파 성공!
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
          hapticsMuted={hapticsMuted}
          muted={muted}
          onFinish={finishGame}
          onToggleHaptics={() => setHapticsMuted((prev) => !prev)}
          onToggleMute={() => setMuted((prev) => !prev)}
        />
      </div>

      <div
        css={{
          minHeight: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
          textAlign: "center",
        }}
      >
        <Text
          as="p"
          typography="t7"
          fontWeight="medium"
          css={{
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {taunt}
        </Text>
      </div>
    </div>
  );
}
