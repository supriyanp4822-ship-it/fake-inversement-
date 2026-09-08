import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      loadFromStorage();
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
