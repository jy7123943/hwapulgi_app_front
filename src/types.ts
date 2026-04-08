export type TargetOption =
  | "회사"
  | "고객"
  | "배우자"
  | "가족"
  | "친구"
  | "연인"
  | "기타";

export type AvatarGender = "girl" | "boy";

export interface SessionInput {
  target: TargetOption | "";
  customTarget?: string;
  nickname: string;
  gender?: AvatarGender | "";
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
  averageRelease: number;
  label: string;
  totalSessions: number;
  totalHits: number;
  averageBefore: number;
  averageAfter: number;
  bestRelease: number;
  totalReleased: number;
  hardestWeekday: string;
  streakDays: number;
  weeklyHeadline: string;
  topTargets: Array<{
    label: string;
    count: number;
  }>;
  calendarDays: Array<{
    dateKey: string;
    dayLabel: string;
    dayNumber: number;
    angerLevel: number;
    sessions: SessionResult[];
  }>;
}

export interface WeeklyArchive {
  id: string;
  label: string;
  periodText: string;
  totalSessions: number;
  totalHits: number;
  totalReleased: number;
  averageBefore: number;
  averageAfter: number;
  averageRelease: number;
  topTarget: string;
  hardestWeekday: string;
}

export interface HomeSnapshot {
  todayCount: number;
  latestTarget: string;
  primaryTarget: string;
  weeklySessions: number;
  weeklyAverageRelease: number;
}
