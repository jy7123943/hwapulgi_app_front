import type { WeeklyArchive, WeeklySummary } from '../../types';
import { apiFetch } from './client';

export async function getWeeklyReport(weekKey?: string): Promise<WeeklySummary> {
  const path = weekKey
    ? `/api/v1/reports/weekly?weekKey=${encodeURIComponent(weekKey)}`
    : '/api/v1/reports/weekly';
  return apiFetch<WeeklySummary>(path);
}

export async function getArchives(): Promise<WeeklyArchive[]> {
  return apiFetch<WeeklyArchive[]>('/api/v1/reports/archives');
}