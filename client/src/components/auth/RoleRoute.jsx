import { Navigate, Outlet } from "react-router-dom";
import Loader from "../common/Loader";
import { useAuth } from "../../context/AuthContext";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, bootLoading } = useAuth();

  if (bootLoading) {
    return <Loader label="Preparing your workspace..." />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/quizzes" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;