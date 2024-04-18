import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function RedirectToIndex() {
  const { user } = useAuth();

  if (user) return <Navigate to="/" />;

  return <Outlet />;
}
