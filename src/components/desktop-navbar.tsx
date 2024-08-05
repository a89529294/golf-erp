import { Sidebar } from "@/components/sidebar";
import logo from "@/assets/logo.svg";

export function DesktopNavbar() {
  return (
    <nav className="fixed bottom-0 top-0 flex w-52 flex-col bg-light-gray sm:hidden">
      <div className="p-6 ">
        <div className="flex items-end gap-3">
          <img src={logo} alt="" className="w-10" />
          <h2 className="text-2xl font-medium">找打球</h2>
        </div>
      </div>

      <Sidebar />
    </nav>
  );
}
