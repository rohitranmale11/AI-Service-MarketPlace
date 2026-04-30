import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboardPath } from '../utils/authRoutes';

export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-mesh px-4">
        <div className="glass rounded-2xl p-6 text-sm font-semibold text-indigo-600">Checking authentication...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return children;
}
