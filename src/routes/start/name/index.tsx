import { colors } from "@toss/tds-colors";
import { Text, TextField } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
} from "../../../components/shared/Surface";
import { TextFieldBox } from "../../../components/shared/TextFieldBox";
import { safeHaptic } from "../../../lib/haptics";
import { sanitizeTextInput } from "../../../lib/sanitize";
import { useAppState } from "../../../state/AppState";
import { BottomCTA } from "../../../components/shared/BottomCTA";
import { MascotHero } from "../../../components/shared/MascotHero";

const GENDER_OPTIONS = [
  { label: "남자", value: "boy" as const },
  { label: "여자", value: "girl" as const },
];

export function NameRoute() {
  const navigate = useNavigate();
  const { draft, recentNicknames, setGender, setNickname } = useAppState();
  const isValid = draft.nickname.trim().length > 0 && !!draft.gender;

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle={"아바타를 생성할 때\n쓰이는 정보에요."}
            title={"그 사람의\n특징을 알려주세요."}
          />

          <TextFieldBox>
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: recentNicknames.length > 0 ? 10 : 0,
                "& > div": {
                  "--text-field-label-color": `${colors.grey900} !important`,
                  "--text-field-hint-color": `${colors.grey500} !important`,
                },
              }}
            >
              <TextField
                autoFocus
                label="이름/별명"
                labelOption="sustain"
                help="실명 대신 별명이나 떠오르는 호칭이어도 괜찮아요."
                onChange={(event) =>
                  setNickname(sanitizeTextInput(event.target.value))
                }
                placeholder="예: 김부장, 팔팔이"
                value={draft.nickname}
                variant="box"
                css={{
                  "& input::placeholder, & textarea::placeholder": {
                    color: colors.grey400,
                    fontSize: 14,
                  },
                }}
              />

              {recentNicknames.length > 0 ? (
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "0 24px 10px",
                  }}
                >
                  <Text
                    as="div"
                    typography="t7"
                    fontWeight="regular"
                    css={{ color: colors.grey900 }}
                  >
                    최근 입력한 이름
                  </Text>
                  <div
                    css={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {recentNicknames.map((nickname) => (
                      <button
                        key={nickname}
                        type="button"
                        onClick={() => setNickname(nickname)}
                        css={{
                          borderRadius: 999,
                          padding: "10px 14px",
                          background: colors.grey100,
                          color: colors.grey900,
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Text as="span" typography="t7" fontWeight="semibold">
                          {nickname}
                        </Text>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </TextFieldBox>

          <TextFieldBox>
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "16px 20px",
              }}
            >
              <Text
                as="div"
                typography="t7"
                fontWeight="regular"
                css={{ color: colors.grey900 }}
              >
                성별
              </Text>
              <div
                css={{
                  display: "flex",
                  gap: 8,
                }}
              >
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = draft.gender === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGender(option.value)}
                      css={{
                        flex: 1,
                        borderRadius: 999,
                        padding: "12px 14px",
                        background: isSelected ? colors.grey900 : colors.grey50,
                        color: isSelected ? colors.white : colors.grey900,
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      <Text
                        as="span"
                        typography="t7"
                        fontWeight="semibold"
                        css={{ color: "inherit" }}
                      >
                        {option.label}
                      </Text>
                    </button>
                  );
                })}
              </div>
            </div>
          </TextFieldBox>
        </BodyStack>
      </ScreenPanel>

      <BottomCTA
        disabled={!isValid}
        onClick={async () => {
          await safeHaptic("tickWeak");
          navigate("/start/anger");
        }}
      >
        다음
      </BottomCTA>
    </AppShell>
  );
}
