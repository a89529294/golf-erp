import { useAuth } from "@/hooks/use-auth";
import { useRouteError } from "react-router-dom";

export function ErrorElement() {
  const error = useRouteError();
  const { logout } = useAuth();
  if (error instanceof Error && error.message === "401") {
    logout();
    return null;
  }

  return <div>讀取資料發生錯誤</div>;
}
