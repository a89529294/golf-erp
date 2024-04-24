import { IconButtonBorderLess } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function UserDisplayLogout() {
  const { user, logout } = useAuth();

  return (
    <div className="absolute bottom-0 right-0 top-0 flex h-full border-r-[10px] border-r-light-blue bg-light-gray py-2.5 pl-2.5">
      <IconButtonBorderLess icon="pfp">{user?.account}</IconButtonBorderLess>
      <div className="h-full border-r border-line-gray" />
      <IconButtonBorderLess icon="leave" onClick={logout}>
        登出
      </IconButtonBorderLess>
    </div>
  );
}
