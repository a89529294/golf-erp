import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function RedirectToLogin() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
}
