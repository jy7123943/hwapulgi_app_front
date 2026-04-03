import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppState } from '../state/AppState';

export function RootGate() {
  const { hasHistory } = useAppState();
  return <Navigate to={hasHistory ? '/home' : '/start/target'} replace />;
}

export function RequireHistory({ children }: PropsWithChildren) {
  const { hasHistory } = useAppState();
  if (!hasHistory) {
    return <Navigate to="/start/target" replace />;
  }

  return children ?? <Outlet />;
}
