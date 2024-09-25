import { navigateUponLogin } from "@/utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function RedirectToIndex() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigateUponLogin(user?.permissions ?? [], navigate);
  }, [isAuthenticated, navigate, user?.permissions]);

  return <Outlet />;
}
