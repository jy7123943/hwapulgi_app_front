import { apiFetch } from './client';

export interface Streak {
  currentStreak: number;
  bestStreak: number;
  totalPlayDays: number;
}

export async function getMyStreak(): Promise<Streak> {
  return apiFetch<Streak>('/api/v1/streaks/me');
}