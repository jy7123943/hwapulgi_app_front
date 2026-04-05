import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppState } from '../state/AppState';

export function RootGate() {
  const { hasHistory, isHydrated } = useAppState();

  if (!isHydrated) {
    return null;
  }

  return <Navigate to={hasHistory ? '/home' : '/start/target'} replace />;
}

export function RequireHistory({ children }: PropsWithChildren) {
  const { hasHistory, isHydrated } = useAppState();

  if (!isHydrated) {
    return null;
  }

  if (!hasHistory) {
    return <Navigate to="/start/target" replace />;
  }

  return children ?? <Outlet />;
}
