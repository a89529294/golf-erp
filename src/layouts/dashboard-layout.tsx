import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { links } from "@/utils/links";
import { Outlet, useNavigation } from "react-router-dom";

export default function DashboardLayout() {
  const { state } = useNavigation();

  return (
    <div className="flex min-h-full text-secondary-dark">
      <nav className="fixed bottom-0 top-0 flex w-52 flex-col bg-light-gray">
        <div className="p-6">
          <div className="flex justify-center py-1.5 text-3xl font-black">
            Logo
          </div>
        </div>

        <Sidebar links={links} />
      </nav>
      <main
        className={cn(
          "ml-52 w-full transition-opacity delay-200 duration-200",
          state === "loading" && "opacity-25",
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
