import { CollapsibleNavLink } from "@/components/collapsible-nav-link";
import { links } from "@/utils/links";
import { motion } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-full text-secondary-dark">
      <nav className="fixed bottom-0 top-0 flex w-52 flex-col bg-light-gray">
        <div className="p-6">
          <div className="flex justify-center py-1.5 text-3xl font-black">
            Logo
          </div>
        </div>
        {links.map((l) => {
          return l.type === "nested" ? (
            <CollapsibleNavLink link={l} />
          ) : (
            <NavLink
              className={({ isActive }) => {
                let base = "relative py-3 pl-7 transition-colors ";
                base += isActive ? " text-white" : "";
                return base;
              }}
              to={l.path}
            >
              {l.label}
              {(() => {
                const isActive = location.pathname === l.path;
                return isActive ? (
                  <motion.div
                    className="absolute inset-0 -z-10 bg-secondary-dark"
                    layoutId="link-bg"
                  />
                ) : null;
              })()}
            </NavLink>
          );
        })}
      </nav>
      <main className="ml-52 w-full">
        <Outlet />
      </main>
    </div>
  );
}
