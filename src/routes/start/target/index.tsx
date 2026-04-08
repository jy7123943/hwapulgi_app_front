import { colors } from "@toss/tds-colors";
import { Button, Text, TextField } from "@toss/tds-mobile";
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
import { ScreenHeading } from "../../../components/shared/ScreenHeading";

const TARGET_EMOJIS: Record<(typeof TARGET_OPTIONS)[number], string> = {
  회사: "🏢",
  고객: "🗣️",
  배우자: "💍",
  가족: "🏠",
  친구: "😎",
  연인: "💌",
  기타: "✏️",
};

export function TargetRoute() {
  const navigate = useNavigate();
  const { draft, recentCustomTargets, setTarget, setCustomTarget } =
    useAppState();
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

  async function selectRecentCustomTarget(value: string) {
    setTarget("기타");
    setCustomTarget(value);
    await safeHaptic("tickWeak");
    navigate("/start/name");
  }

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <ScreenHeading
            subtitle={"선택하면 바로 혼내주러 가요."}
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
                  borderRadius: 24,
                  minHeight: 88,
                  padding: "14px 10px",
                  background: draft.target === target ? "#bff4d5" : "#fffef9",
                  color: draft.target === target ? "#4a316a" : colors.grey900,
                  border: "4px solid #4e356d",
                  transition:
                    "transform 160ms ease, background-color 160ms ease, border-color 160ms ease",
                  boxShadow:
                    draft.target === target
                      ? "0 6px 0 rgba(78, 53, 109, 0.24)"
                      : "0 6px 0 rgba(58, 35, 93, 0.16)",
                  ":active": {
                    transform: "translateY(2px)",
                  },
                }}
              >
                <span
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span css={{ fontSize: 24, lineHeight: 1 }}>
                    {TARGET_EMOJIS[target]}
                  </span>
                  <Text as="span" typography="t5" fontWeight="bold">
                    {target}
                  </Text>
                </span>
              </button>
            ))}
          </div>

          {draft.target === "기타" ? (
            <div
              css={{
                background: "#fffef9",
                border: "4px solid #4e356d",
                boxShadow: "0 6px 0 rgba(52, 33, 83, 0.18)",
                borderRadius: 28,
              }}
            >
              <div
                css={{
                  "& > div": {
                    "--text-field-label-color": `${colors.grey900} !important`,
                    "--text-field-hint-color": `${colors.grey500} !important`,
                  },
                }}
              >
                <TextField
                  ref={customTargetInputRef}
                  id="custom-target"
                  label="직접 입력"
                  labelOption="sustain"
                  autoFocus
                  maxLength={15}
                  onChange={(event) =>
                    handleCustomTargetChange(event.target.value)
                  }
                  placeholder="예: 거래처, 동네 빌런"
                  value={draft.customTarget}
                  variant="box"
                  css={{
                    "& input::placeholder, & textarea::placeholder": {
                      color: colors.grey400,
                      fontSize: 14,
                    },
                  }}
                />
              </div>
              <div
                css={{
                  padding: 20,
                  paddingTop: 0,
                }}
              >
                <Button
                  color="dark"
                  disabled={!canMoveNext}
                  display="block"
                  onClick={() => navigate("/start/name")}
                  size="large"
                  css={{
                    marginTop: 12,
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  다음
                </Button>
              </div>
            </div>
          ) : null}

          {recentCustomTargets.length > 0 ? (
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "10px 10px",
              }}
            >
              <Text
                as="div"
                typography="t6"
                fontWeight="bold"
                css={{ color: colors.grey700 }}
              >
                내가 추가한 대상
              </Text>
              <div
                css={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {recentCustomTargets.map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => void selectRecentCustomTarget(target)}
                    css={{
                      borderRadius: 999,
                      padding: "10px 14px",
                      background: "#f2ffef",
                      color: "#4a316a",
                      border: "3px solid #4e356d",
                      boxShadow: "0 4px 0 rgba(58, 35, 93, 0.14)",
                    }}
                  >
                    <Text as="span" typography="t7" fontWeight="semibold">
                      {target}
                    </Text>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </BodyStack>
      </ScreenPanel>
    </AppShell>
  );
}
