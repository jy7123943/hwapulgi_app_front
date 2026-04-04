import { colors } from "@toss/tds-colors";
import { Button, Text } from "@toss/tds-mobile";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
} from "../../../components/shared/Surface";
import { TARGET_OPTIONS } from "../../../constants";
import { safeHaptic } from "../../../lib/haptics";
import { sanitizeTextInput } from "../../../lib/sanitize";
import { useAppState } from "../../../state/AppState";
import { MascotHero } from "../../../components/shared/MascotHero";

export function TargetRoute() {
  const navigate = useNavigate();
  const { draft, setTarget, setCustomTarget } = useAppState();
  const customTargetInputRef = useRef<HTMLInputElement>(null);

  const canMoveNext =
    draft.target !== "기타" || (draft.customTarget ?? "").trim().length > 0;

  useEffect(() => {
    if (draft.target === "기타") {
      customTargetInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.requestAnimationFrame(() => {
        customTargetInputRef.current?.focus();
      });
    }
  }, [draft.target]);

  async function selectTarget(target: (typeof TARGET_OPTIONS)[number]) {
    setTarget(target);
    await safeHaptic("tickWeak");

    if (target !== "기타") {
      navigate("/start/name");
    }
  }

  function handleCustomTargetChange(value: string) {
    setCustomTarget(sanitizeTextInput(value));
  }

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle={"선택하면 바로\n혼내주러 가요."}
            title={"오늘은 누구 때문에\n화가 났나요?"}
          />

          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
              "@media (max-width: 560px)": {
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {TARGET_OPTIONS.map((target) => (
              <button
                key={target}
                onClick={() => void selectTarget(target)}
                type="button"
                css={{
                  borderRadius: 18,
                  minHeight: 70,
                  padding: "10px 8px",
                  background:
                    draft.target === target
                      ? "linear-gradient(135deg, #8f1fff, #ff6a4e)"
                      : "linear-gradient(180deg, #ffffff 0%, #fff6f0 100%)",
                  color:
                    draft.target === target
                      ? colors.background
                      : colors.grey900,
                  border:
                    draft.target === target
                      ? "1px solid transparent"
                      : "1px solid rgba(110, 88, 72, 0.08)",
                  transition:
                    "transform 160ms ease, background-color 160ms ease, border-color 160ms ease",
                  boxShadow:
                    draft.target === target
                      ? "0 12px 18px rgba(143, 31, 255, 0.18)"
                      : "0 8px 14px rgba(68, 41, 28, 0.05)",
                  ":active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Text as="span" typography="t5" fontWeight="semibold">
                  {target}
                </Text>
              </button>
            ))}
          </div>

          {draft.target === "기타" ? (
            <div
              css={{
                background: "rgba(255, 252, 248, 0.96)",
                border: "1px solid rgba(110, 88, 72, 0.08)",
                boxShadow: "0 18px 40px rgba(68, 41, 28, 0.08)",
                borderRadius: 28,
                padding: 20,
                marginTop: 6,
              }}
            >
              <label
                css={{
                  display: "block",
                  marginBottom: 8,
                  color: colors.grey600,
                  fontSize: 13,
                }}
                htmlFor="custom-target"
              >
                직접 입력
              </label>
              <input
                ref={customTargetInputRef}
                id="custom-target"
                autoFocus
                maxLength={15}
                onChange={(event) =>
                  handleCustomTargetChange(event.target.value)
                }
                placeholder="예: 출근길 지하철"
                value={draft.customTarget}
                css={{
                  width: "100%",
                  borderRadius: 16,
                  border: "1px solid rgba(110, 88, 72, 0.12)",
                  background: "#fff",
                  padding: "14px 16px",
                  color: colors.grey900,
                  appearance: "none",
                }}
              />
              <Button
                color="dark"
                disabled={!canMoveNext}
                display="block"
                onClick={() => navigate("/start/name")}
                size="large"
                css={{
                  marginTop: 12,
                }}
              >
                다음
              </Button>
            </div>
          ) : null}
        </BodyStack>
      </ScreenPanel>
    </AppShell>
  );
}
