import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, bootLoading } = useAuth();
  const location = useLocation();

  if (bootLoading) {
    return <Loader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;