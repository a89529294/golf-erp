import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

export function PermissionGuard({
  routePermissions,
}: {
  routePermissions: string[];
}) {
  const { user } = useAuth();

  // user will always exist, this component is only under <RedirectToLoginIfNotAuthed/>
  const userPermissions = user!.permissions;

  // if route has no permission requirement, let everyone through
  if (routePermissions.length === 0) return <Outlet />;

  if (
    userPermissions.filter((up) => routePermissions.includes(up)).length === 0
  )
    return <Navigate to="/" />;

  return <Outlet />;
}
