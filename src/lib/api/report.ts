import type { WeeklyArchive, WeeklySummary } from '../../types';
import { apiFetch } from './client';

export async function getWeeklyReport(): Promise<WeeklySummary> {
  return apiFetch<WeeklySummary>('/api/v1/reports/weekly');
}

export async function getArchives(): Promise<WeeklyArchive[]> {
  return apiFetch<WeeklyArchive[]>('/api/v1/reports/archives');
}