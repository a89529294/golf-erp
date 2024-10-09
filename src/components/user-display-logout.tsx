import { IconButtonBorderLess } from "@/components/ui/button";
import { UserModifyPasswordDialog } from "@/components/user-modify-password-dialog";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useNavigation } from "react-router-dom";

export function UserDisplayLogout({
  className,
  btnClassName,
}: {
  className?: string;
  btnClassName?: string;
}) {
  const { user, logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-20 shrink-0 border-r-[10px] border-r-light-blue bg-light-gray py-2.5 pl-2.5 ",
        navigation.state !== "idle" && "invisible",
        className,
      )}
      ref={ref}
    >
      <IconButtonBorderLess className={btnClassName} icon="pfp">
        {user?.username}
      </IconButtonBorderLess>
      <div className="h-full border-r border-line-gray" />
      <UserModifyPasswordDialog btnClassName={btnClassName} />
      <div className="h-full border-r border-line-gray" />
      <IconButtonBorderLess
        className={btnClassName}
        icon="leave"
        onClick={logout}
      >
        登出
      </IconButtonBorderLess>
    </div>
  );
}
