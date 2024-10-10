import { useAuth } from "@/hooks/use-auth";
import { navigateUponLogin } from "@/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigateUponLogin(user?.permissions ?? [], navigate);
  }, [isAuthenticated, navigate, user?.permissions]);

  return null;
}
