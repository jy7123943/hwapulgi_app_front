import { Navigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';

export function RootGate() {
  const { hasHistory } = useAppState();
  return <Navigate to={hasHistory ? '/home' : '/start/target'} replace />;
}

export function RequireHistory() {
  const { hasHistory } = useAppState();
  return hasHistory ? null : <Navigate to="/start/target" replace />;
}
