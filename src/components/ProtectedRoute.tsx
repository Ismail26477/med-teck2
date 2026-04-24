import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { sessionManager } from '@/lib/session';
import { useStore, loadUserData } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useStore((s) => s.user);
  const isLoading = useStore((s) => s.isLoading);

  useEffect(() => {
    if (sessionManager.isLoggedIn() && user) {
      // Load user's data from database when userId changes
      loadUserData(user._id).catch((error) => {
        console.error('[v0] Failed to load user data:', error);
      });
    }
  }, [user?._id]);

  // If not logged in, redirect to login
  if (!sessionManager.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // If loading data, show nothing (app is initializing)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
