import type { SessionResult } from '../types';

export function formatSessionLabel(session: SessionResult) {
  return session.customTarget?.trim() || session.nickname.trim() || session.target;
}