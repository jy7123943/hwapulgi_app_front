import { apiFetch } from './client';

export interface Achievement {
  type: string;
  title: string;
  description: string;
  achievedAt: string;
}

export async function getMyAchievements(): Promise<Achievement[]> {
  return apiFetch<Achievement[]>('/api/v1/achievements/me');
}