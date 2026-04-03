import { colors } from "@toss/tds-colors";
import { Slider, Text, TextField } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  BodyStack,
  ScreenPanel,
} from "../../../components/shared/Surface";
import { TextFieldBox } from "../../../components/shared/TextFieldBox";
import { safeHaptic } from "../../../lib/haptics";
import { useAppState } from "../../../state/AppState";
import { BottomCTA } from "../../../components/shared/BottomCTA";
import { MascotHero } from "../../../components/shared/MascotHero";

export function AngerRoute() {
  const navigate = useNavigate();
  const { draft, setAngerBefore, setMemo } = useAppState();

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle="이 수치가 기준점이 돼요."
            title={"지금 나의 분노\n게이지는?"}
          />

          <div
            css={{
              background: "#ffdcd8",
              boxShadow: "0 18px 40px rgba(68, 41, 28, 0.08)",
              borderRadius: 28,
              padding: 20,
              paddingTop: 26,
            }}
          >
            <Text
              as="div"
              typography="t2"
              fontWeight="bold"
              css={{
                marginBottom: 20,
                color: colors.red500,
              }}
            >
              {draft.angerBefore} / 100
            </Text>
            <Slider
              color="#c74a32"
              label={{ min: "괜찮음", mid: "빡침", max: "폭발 직전" }}
              max={100}
              min={10}
              onValueChange={setAngerBefore}
              value={draft.angerBefore}
            />
          </div>

          <TextFieldBox>
            <TextField
              label="한 줄 메모 (선택)"
              labelOption="sustain"
              onChange={(event) => setMemo(event.target.value)}
              placeholder="무슨 일이 있었나요?"
              value={draft.memo}
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
        onClick={async () => {
          await safeHaptic("softMedium");
          navigate("/play");
        }}
      >
        시작하기
      </BottomCTA>
    </AppShell>
  );
}
