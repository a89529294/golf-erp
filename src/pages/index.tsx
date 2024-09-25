import { useAuth } from "@/hooks/use-auth";
import { navigateUponLogin } from "@/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
    navigateUponLogin(user?.permissions ?? [], navigate);
  }, [user, navigate]);

  return null;
}
