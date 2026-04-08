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
import { ScreenHeading } from "../../../components/shared/ScreenHeading";

const GENDER_OPTIONS = [
  { label: "남자", value: "boy" as const },
  { label: "여자", value: "girl" as const },
];

function AvatarOptionPreview({ gender }: { gender: "boy" | "girl" }) {
  const hairSrc =
    gender === "boy"
      ? "/avatar/hair/boy_hair.png"
      : "/avatar/hair/girl_hair.png";
  const faceWidth = 70;
  const hairWidth = gender === "boy" ? 112 : 130;
  const hairTop = gender === "boy" ? -10 : -14;

  return (
    <div
      css={{
        position: "relative",
        width: 96,
        height: 70,
        margin: "0 auto",
      }}
    >
      <img
        alt=""
        src="/avatar/face/face_smile.png"
        css={{
          position: "absolute",
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          width: faceWidth,
          height: "auto",
          objectFit: "contain",
          zIndex: 2,
        }}
      />
      <img
        alt=""
        src={hairSrc}
        css={{
          position: "absolute",
          left: "50%",
          top: hairTop,
          transform: "translateX(-50%)",
          width: hairWidth,
          height: "auto",
          objectFit: "contain",
          zIndex: 3,
        }}
      />
    </div>
  );
}

export function NameRoute() {
  const navigate = useNavigate();
  const { draft, recentNicknames, setGender, setNickname } = useAppState();
  const isValid = draft.nickname.trim().length > 0 && !!draft.gender;
  const shouldShowNameHint = draft.nickname.trim().length === 0;

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <ScreenHeading
            subtitle={"아바타를 생성할 때 쓰이는 정보에요."}
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
                    typography="t6"
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
                          background: "#f2ffef",
                          color: "#4a316a",
                          border: "3px solid #4e356d",
                          boxShadow: "0 4px 0 rgba(58, 35, 93, 0.14)",
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
                typography="t6"
                fontWeight="medium"
                css={{ color: colors.grey900 }}
              >
                성별
              </Text>
              <div
                css={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
                        borderRadius: 28,
                        padding: "14px 10px 12px",
                        background: isSelected ? "#bff4d5" : "#fffef9",
                        color: "#4a316a",
                        border: "4px solid #4e356d",
                        boxShadow: isSelected
                          ? "0 4px 0 rgba(78, 53, 109, 0.24)"
                          : "0 4px 0 rgba(58, 35, 93, 0.14)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0,
                      }}
                    >
                      <AvatarOptionPreview gender={option.value} />
                      <Text
                        as="span"
                        typography="t6"
                        fontWeight="bold"
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
        topAccessory={
          shouldShowNameHint ? (
            <Text
              as="div"
              typography="t7"
              fontWeight="medium"
              css={{
                color: colors.red500,
                textAlign: "center",
              }}
            >
              이름을 입력해야 다음으로 넘어갈 수 있어요.
            </Text>
          ) : null
        }
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
