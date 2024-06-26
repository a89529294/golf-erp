import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { clearUser } = useAuth();

  useEffect(() => {
    if (error instanceof Error && error.message === "401") {
      clearUser();
      navigate("/login");
    }
  }, [error, clearUser, navigate]);

  console.log(error);

  return <div className="ml-2.5 ">讀取資料發生錯誤</div>;
}
