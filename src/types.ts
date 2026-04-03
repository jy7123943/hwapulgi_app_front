export type TargetOption =
  | '회사'
  | '상사'
  | '동료'
  | '고객'
  | '가족'
  | '친구'
  | '연인'
  | '나 자신'
  | '기타';

export interface SessionInput {
  target: TargetOption | '';
  customTarget?: string;
  nickname: string;
  angerBefore: number;
  memo: string;
}

export interface SessionResult extends SessionInput {
  id: string;
  createdAt: string;
  hits: number;
  skillShots: number;
  angerAfter: number;
  releasedPercent: number;
  points: number;
}

export interface WeeklySummary {
  totalSessions: number;
  totalHits: number;
  averageBefore: number;
  averageAfter: number;
  bestRelease: number;
}
