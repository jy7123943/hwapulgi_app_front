import type { TargetOption } from "./types";
import type { SessionInput } from "./types";

export const TARGET_OPTIONS: TargetOption[] = [
  "회사",
  "상사",
  "동료",
  "고객",
  "가족",
  "친구",
  "연인",
  "나 자신",
  "기타",
];

export const STORAGE_KEY = "hwapulgi/sessions";
export const START_GUIDE_STORAGE_KEY = "hwapulgi/start-guide-seen";

export const LOADING_MESSAGES = [
  "분노를 조준하고 있어요...",
  "아바타를 생성하는 중...",
  "오늘의 화를 안전하게 꺼내는 중...",
];

export const GAME_START_LINE = "마음 가는 대로, 한 대씩 시작해보아요.";

export const HIT_SUPPORT_LINES = {
  early: [
    "웃기고 있네.",
    "아직 정신 못 차렸지?",
    "계속 그렇게 나와봐.",
    "오늘은 그냥 안 넘어가.",
  ],
  mid: [
    "이제 좀 당황하지?",
    "아까 그 기분, 나도 똑같았어.",
    "조금씩 알겠지?",
    "이제 슬슬 느껴지지?",
  ],
  late: [
    "이제야 좀 풀리네.",
    "다신 그러지 마.",
    "이번엔 진짜 사과해.",
    "이제 좀 알겠어?",
  ],
  finish: [
    "그래, 이제 됐어.",
    "알았으면 됐어.",
    "여기까지 할게.",
    "이번엔 여기서 끝낼게.",
  ],
};

export const defaultDraft: SessionInput = {
  target: "",
  customTarget: "",
  nickname: "",
  gender: "boy",
  angerBefore: 100,
  memo: "",
};
