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
      <CollapsibleContent className="data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down flex flex-col overflow-hidden pt-1">
        {Object.values(link.subLinks).map((subLink) => {
          const isActive =
            subLink.type === "flat"
              ? pathname.includes(subLink.path)
              : Object.values(subLink.paths).find((v) => pathname.includes(v));
          const path =
            subLink.type === "flat"
              ? subLink.path
              : Object.values(subLink.paths)[0];
          return (
            <NavLink
              to={path}
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
