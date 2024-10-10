import { DesktopNavbar } from "@/components/desktop-navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { UserDisplayLogout } from "@/components/user-display-logout";
import { cn } from "@/lib/utils";
import { Outlet, useNavigation } from "react-router-dom";

export default function DashboardLayout() {
  const { state } = useNavigation();

  return (
    <div className="flex min-h-full text-secondary-dark sm:grid sm:grid-cols-2 ">
      <DesktopNavbar />

      <main
        className={cn(
          "ml-52 flex w-full flex-row-reverse transition-opacity delay-200 duration-200 sm:col-span-2 sm:ml-0",
          state === "loading" && "opacity-25",
        )}
      >
        <UserDisplayLogout className="sm:hidden" />
        <Outlet />
      </main>

      <MobileNavbar />
    </div>
  );
}
