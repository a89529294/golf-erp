import { IconButtonBorderLess } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export function UserDisplayLogout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="absolute bottom-0 right-0 top-0 flex h-full border-r-[10px] border-r-light-blue bg-light-gray py-2.5 pl-2.5">
      <IconButtonBorderLess icon="pfp">{user.name}</IconButtonBorderLess>
      <div className="h-full border-r border-line-gray" />
      <IconButtonBorderLess icon="leave" onClick={logout}>
        登出
      </IconButtonBorderLess>
    </div>
  );
}
