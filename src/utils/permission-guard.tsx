import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

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

  // user has permission
  if (userPermissions.filter((up) => routePermissions.includes(up)).length > 0)
    return <Outlet />;

  // user doesnt have permisson but is an employee of a store
  if (storeCategory) {
    if (user!.allowedStores.ground.length > 0 && storeCategory === "ground")
      return <Outlet />;
    if (user!.allowedStores.golf.length > 0 && storeCategory === "golf")
      return <Outlet />;
    if (
      user!.allowedStores.simulator.length > 0 &&
      storeCategory === "simulator"
    )
      return <Outlet />;
  }

  return <Navigate to="/" />;
}
