import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NestedLink } from "@/utils/links";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export function CollapsibleNavLink({ link }: { link: NestedLink }) {
  const { pathname } = useLocation();
  const isSubLinkActive = pathname.startsWith(link.basePath);
  const [open, setOpen] = useState(isSubLinkActive);

  useEffect(() => {
    setOpen(isSubLinkActive);
  }, [isSubLinkActive]);

  return (
    <Collapsible
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <CollapsibleTrigger asChild>
        <NavLink
          to={link.path}
          className={(() => {
            let base = "group relative block py-3 pl-7 transition-colors ";
            base += isSubLinkActive ? "text-white" : "";
            return base;
          })()}
        >
          <div className="flex items-center justify-between pr-4">
            {link.label}
            <ChevronDown className="transition-transform group-data-[state=closed]:-rotate-180" />
          </div>
          {(() => {
            return isSubLinkActive ? (
              <motion.div
                className="absolute inset-0 -z-10 bg-secondary-dark"
                layoutId="link-bg"
              />
            ) : null;
          })()}
        </NavLink>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col pt-1">
        {link.subLinks.map((subLink) => {
          const isActive = location.pathname === subLink.path;
          return (
            <NavLink
              to={subLink.path}
              className={() => {
                let base = "relative py-2.5 pl-10 text-sm transition-colors ";
                base += isActive ? "  text-white" : "";
                return base;
              }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 -z-10 border-l-[3px] border-secondary-dark bg-orange"
                  layoutId="nested-link-bg"
                />
              )}
              {subLink.label}
            </NavLink>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
