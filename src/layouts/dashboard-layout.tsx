import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { links } from "@/utils/links";
import { ChevronDown } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  console.log(location);

  return (
    <div className="text-secondary-dark flex min-h-full">
      <nav className="bg-light-gray fixed bottom-0 top-0 flex w-52 flex-col">
        <div className="p-6">
          <div className="flex justify-center py-1.5 text-3xl font-black">
            Logo
          </div>
        </div>
        {links.map((l) => {
          return l.type === "nested" ? (
            <Collapsible>
              <NavLink
                to={l.path}
                className={() => {
                  const isActive = location.pathname.startsWith(l.basePath);
                  let base = "block py-3 pl-7 ";
                  base += isActive ? "bg-secondary-dark text-white" : "";
                  return base;
                }}
              >
                <CollapsibleTrigger asChild>
                  <div className="group flex items-center justify-between pr-4">
                    {l.label}
                    <ChevronDown className="transition-transform group-data-[state=closed]:-rotate-180" />
                  </div>
                </CollapsibleTrigger>
              </NavLink>
              <CollapsibleContent className="flex flex-col">
                {l.subLinks.map((subLink) => {
                  return (
                    <NavLink
                      to={subLink.path}
                      className={({ isActive }) => {
                        let base = "py-2.5 pl-10 ";
                        base += isActive ? "bg-orange text-white" : "";
                        return base;
                      }}
                    >
                      {subLink.label}
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <NavLink
              className={({ isActive }) => {
                let base = "py-3 pl-7 ";
                base += isActive ? "bg-secondary-dark text-white" : "";
                return base;
              }}
              to={l.path}
            >
              {l.label}
            </NavLink>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
