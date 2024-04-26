import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

export function ErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { clearUser } = useAuth();

  useEffect(() => {
    if (error instanceof Error && error.message === "401") {
      clearUser();
      navigate("/login");
    }
  }, [error, clearUser, navigate]);

  return <div>讀取資料發生錯誤</div>;
}
