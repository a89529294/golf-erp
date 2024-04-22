import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePrevious } from "@/hooks/use-previous";
import { cn } from "@/lib/utils";
import { FlatLink, NestedLink, isBelowLink } from "@/utils/links";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export function SidebarAccordion({
  links,
}: {
  links: (NestedLink | FlatLink)[];
}) {
  const { pathname } = useLocation();
  const [openedItem, setOpenedItem] = useState(
    links.find((link) =>
      pathname.startsWith("basePath" in link ? link.basePath : link.path),
    )!.path,
  );
  const [nestedLinksClosed, setNestedLinksClosed] = useState(true);

  const prevLink = usePrevious(
    links.find((link) =>
      pathname.startsWith(link.type === "nested" ? link.basePath : link.path),
    ),
  );

  const isLinkActive = (link: NestedLink | FlatLink) => {
    const getPath = (link: NestedLink | FlatLink) =>
      link.type === "nested" ? link.basePath : link.path;

    if (!prevLink) return pathname.startsWith(getPath(link));
    if (prevLink.type === "nested" && isBelowLink(getPath(prevLink), pathname))
      return pathname.startsWith(getPath(link)) && nestedLinksClosed;
    return pathname.startsWith(getPath(link));
  };

  useEffect(() => {
    setNestedLinksClosed(false);
  }, [nestedLinksClosed]);

  return (
    <Accordion
      value={openedItem}
      onValueChange={(v) => {
        setOpenedItem(v);
        console.log(v);
      }}
      type="single"
      collapsible
      className="w-full"
    >
      {links.map((link) => (
        <AccordionItem value={link.path} key={link.path}>
          <AccordionTrigger asChild>
            <NavLink to={link.path} className="group relative block py-3 pl-7">
              <div
                className={cn(
                  "flex w-full items-center justify-between pr-4 transition-colors",
                  isLinkActive(link) && "text-white ",
                )}
              >
                {link.label}
                {link.type === "nested" && (
                  <ChevronDown className="transition-transform group-data-[state=closed]:-rotate-180" />
                )}
              </div>
              {isLinkActive(link) ? (
                <motion.div
                  className=" absolute inset-0 -z-10 bg-secondary-dark"
                  layoutId="link-bg"
                  layout
                />
              ) : null}
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
                const isActive = location.pathname === subLink.path;
                return (
                  <NavLink
                    to={subLink.path}
                    className={() => {
                      let base =
                        "relative py-2.5 pl-10 text-sm transition-colors ";
                      base += isActive ? "  text-white" : "";
                      return base;
                    }}
                    key={subLink.path}
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
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
