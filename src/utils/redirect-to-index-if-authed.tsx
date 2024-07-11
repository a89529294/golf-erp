import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function RedirectToIndex() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/member-management" />;

  // if (isAuthenticated) return <Navigate to="/" />;

  return <Outlet />;
}
