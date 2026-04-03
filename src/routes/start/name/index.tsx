import { colors } from "@toss/tds-colors";
import { TextField } from "@toss/tds-mobile";
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

export function NameRoute() {
  const navigate = useNavigate();
  const { draft, setNickname } = useAppState();
  const isValid = draft.nickname.trim().length > 0;

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle={"실명 대신 별명이나\n떠오르는 호칭이어도 괜찮아요."}
            title={"그 사람의 이름을\n알려주세요."}
          />

          <TextFieldBox>
            <TextField
              autoFocus
              label="이름/별명"
              labelOption="sustain"
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
