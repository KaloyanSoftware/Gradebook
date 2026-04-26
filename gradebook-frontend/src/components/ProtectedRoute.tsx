import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

const homeByRole: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  PARENT: '/parent/dashboard',
  STUDENT: '/student/dashboard',
};

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { session, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (allowedRoles && !user) return <div>Loading...</div>;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeByRole[user.role]} replace />;
  }

  return <>{children}</>;
}
