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

export const LOADING_MESSAGES = [
  "분노를 조준하고 있어요...",
  "아바타를 생성하는 중...",
  "오늘의 화를 안전하게 꺼내는 중...",
];

export const TAUNT_LINES = [
  "그 정도로 끝낼 건가요?",
  "속 시원하게 한 번 더 가죠.",
  "오늘 쌓인 감정, 여기서 털어내요.",
  "이건 안전한 샌드백이라고 생각해요.",
];

export const defaultDraft: SessionInput = {
  target: "",
  customTarget: "",
  nickname: "",
  angerBefore: 100,
  memo: "",
};
