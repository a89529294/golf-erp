import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

export function PermissionGuard({
  routePermissions,
  storeCategory,
}: {
  routePermissions: string[];
  storeCategory?: "ground" | "golf" | "simulator";
}) {
  const { user } = useAuth();

  // user will always exist, this component is only under <RedirectToLoginIfNotAuthed/>
  const userPermissions = user!.permissions;

  // if route has no permission requirement, let everyone through
  if (routePermissions.length === 0) return <Outlet />;

  // let admin through
  if (user!.isAdmin) return <Outlet />;

  // user has permission
  if (
    userPermissions.filter((up) => routePermissions.includes(up)).length > 0
  ) {
    if (storeCategory === "golf") {
      if (user!.allowedStores.golf.length !== 0) return <Outlet />;
      toast.error("沒有管理任何高爾夫廠商");
      return <Navigate to="/" />;
    }

    if (storeCategory === "ground") {
      if (user!.allowedStores.ground.length !== 0) return <Outlet />;
      toast.error("沒有管理任何練習場廠商");
      return <Navigate to="/" />;
    }

    if (storeCategory === "simulator") {
      if (user!.allowedStores.simulator.length !== 0) return <Outlet />;
      toast.error("沒有管理任何模擬器廠商");
      return <Navigate to="/" />;
    }

    return <Outlet />;
  }

  return <Navigate to="/" />;
}
