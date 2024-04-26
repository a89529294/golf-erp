import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function RedirectToLogin() {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
}
