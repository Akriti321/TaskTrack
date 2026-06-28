import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) return <Loader label="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
