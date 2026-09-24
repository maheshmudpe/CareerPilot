import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;