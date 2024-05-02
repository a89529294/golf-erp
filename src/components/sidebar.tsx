import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePrevious } from "@/hooks/use-previous";
import { cn } from "@/lib/utils";
import {
  FlatLink,
  NestedLink,
  filterLinksByUserPermissions,
  findLinkFromPathname,
  isBelowLink,
} from "@/utils/links";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const { pathname } = useLocation();
  const state = useNavigation();
  const [nestedLinksClosed, setNestedLinksClosed] = useState(false);
  const { user } = useAuth();

  const links = filterLinksByUserPermissions(user!.permissions);

  const prevLink = usePrevious(findLinkFromPathname(pathname));

  const isLinkActive = (link: NestedLink | FlatLink) => {
    const getPath = (link: NestedLink | FlatLink) =>
      link.type === "nested" ? link.basePath : link.path;

    if (
      prevLink &&
      prevLink.type === "nested" &&
      isBelowLink(getPath(prevLink), pathname)
    ) {
      console.log(getPath(link));
      return pathname.startsWith(getPath(link)) && nestedLinksClosed;
    }

    return pathname.startsWith(getPath(link));
  };

  useEffect(() => {
    setNestedLinksClosed(false);
  }, [nestedLinksClosed]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={findLinkFromPathname(pathname)?.path}
    >
      {links.map((link) => (
        <AccordionItem value={link.path} key={link.path}>
          <AccordionTrigger asChild>
            <NavLink to={link.path} className="group relative block py-3 pl-7">
              {({ isPending }) => (
                <>
                  <div
                    className={cn(
                      "flex w-full items-center justify-between pr-4 transition-colors",
                      isLinkActive(link) && "text-white",
                    )}
                  >
                    {link.label}
                    {link.type === "nested" && (
                      <ChevronDown className="transition-transform duration-300 group-data-[state=closed]:-rotate-180" />
                    )}
                  </div>
                  {isLinkActive(link) && (
                    <motion.div
                      className="absolute inset-0 -z-10 bg-secondary-dark"
                      layoutId="link-bg"
                    />
                  )}
                  {isPending && (
                    <motion.div
                      className="absolute inset-0 -z-10 bg-secondary-dark !opacity-50"
                      layoutId="link-bg"
                    />
                  )}
                </>
              )}
            </NavLink>
          </AccordionTrigger>
          {link.type === "nested" && (
            <AccordionContent
              className="flex flex-col pt-1"
              onAnimationEnd={(e) => {
                !link.path.startsWith(pathname) &&
                  setNestedLinksClosed(
                    e.currentTarget.dataset.state === "closed",
                  );
              }}
            >
              {link.subLinks.map((subLink) => {
                const isActive =
                  subLink.type === "multiple"
                    ? subLink.paths.find((p) => pathname.startsWith(p))
                    : pathname === subLink.path;
                const path =
                  subLink.type === "multiple" ? subLink.paths[0] : subLink.path;
                return (
                  <NavLink
                    to={path}
                    className={() => {
                      let base =
                        "relative py-2.5 pl-10 text-sm transition-colors ";
                      base +=
                        isActive && state.state !== "loading"
                          ? "  text-white"
                          : "";
                      return base;
                    }}
                    key={path}
                  >
                    {({ isPending }) => (
                      <>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 -z-10 border-l-[3px] border-secondary-dark bg-orange"
                            layoutId="nested-link-bg"
                          />
                        )}
                        {isPending && (
                          <motion.div
                            className="absolute inset-0 -z-10 border-l-[3px] border-secondary-dark bg-orange/50"
                            layoutId="nested-link-bg"
                          />
                        )}
                        {subLink.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
