import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
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
  const hasFinishedRef = useRef(false);

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

  useEffect(() => {
    if (hits > 0 && currentAnger <= 0) {
      finishGame();
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

        <GameActions
          muted={muted}
          onFinish={finishGame}
          onToggleMute={() => setMuted((prev) => !prev)}
        />
      </div>
    </div>
  );
}
