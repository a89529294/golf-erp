import { Sidebar } from "@/components/sidebar";
import { UserDisplayLogout } from "@/components/user-display-logout";
import { cn } from "@/lib/utils";
import { Outlet, useNavigation } from "react-router-dom";
import logo from "@/assets/logo.svg";

export default function DashboardLayout() {
  const { state } = useNavigation();

  return (
    <div className="flex min-h-full text-secondary-dark">
      <nav className="fixed top-0 bottom-0 flex flex-col w-52 bg-light-gray">
        <div className="p-6 ">
          <div className="flex items-end gap-3">
            <img src={logo} alt="" className="w-10" />
            <h2 className="text-2xl font-medium">找打球</h2>
          </div>
        </div>

        <Sidebar />
      </nav>
      <main
        className={cn(
          "ml-52 flex w-full flex-row-reverse transition-opacity delay-200 duration-200",
          state === "loading" && "opacity-25",
        )}
      >
        <UserDisplayLogout />
        <Outlet />
      </main>
    </div>
  );
}
