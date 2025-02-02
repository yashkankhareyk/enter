import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} />;
  }

  if (requiredRole === 'admin' && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // For owner/student routes, check the userType
  if ((requiredRole === 'owner' || requiredRole === 'student') && user.userType !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;