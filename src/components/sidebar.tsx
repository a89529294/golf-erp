import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { usePrevious } from "@/hooks/use-previous";
import { cn } from "@/lib/utils";
import {
  FlatLink,
  MultipleLink,
  NestedLink,
  // filterLinksByUserPermissions,
  findLinkFromPathname,
  isBelowLink,
  linksKV,
} from "@/utils/links";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigation } from "react-router-dom";

export function Sidebar() {
  const { pathname } = useLocation();
  const prevLink = usePrevious(findLinkFromPathname(pathname));
  const [nestedLinksClosed, setNestedLinksClosed] = useState(false);

  const { user } = useAuth();

  // const links = filterLinksByUserPermissions(user!.permissions);

  const isLinkAllowed = (link: NestedLink | FlatLink | MultipleLink) => {
    return !!user?.permissions.some((up) =>
      link.allowedPermissions.includes(up),
    );
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
      {isLinkAllowed(linksKV["driving-range"]) && (
        <AccordionItemWrapper
          link={linksKV["driving-range"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
        />
      )}
      {isLinkAllowed(linksKV["golf"]) && (
        <AccordionItemWrapper
          link={linksKV["golf"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
        />
      )}
      {isLinkAllowed(linksKV["indoor-simulator"]) && (
        <AccordionItemWrapper
          link={linksKV["indoor-simulator"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
        />
      )}
      {isLinkAllowed(linksKV["system-management"]) && (
        <AccordionItemWrapper
          link={linksKV["system-management"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
        />
      )}
    </Accordion>
  );
}

function AccordionItemWrapper({
  link,
  prevLink,
  nestedLinksClosed,
  setNestedLinksClosed,
}: {
  link: NestedLink;
  prevLink: NestedLink | null;
  nestedLinksClosed: boolean;
  setNestedLinksClosed: Dispatch<SetStateAction<boolean>>;
}) {
  const { pathname } = useLocation();

  const state = useNavigation();

  const isLinkActive = (link: NestedLink) => {
    if (prevLink && isBelowLink(prevLink.basePath, pathname)) {
      return pathname.startsWith(link.basePath) && nestedLinksClosed;
    }

    return pathname.startsWith(link.basePath);
  };

  return (
    <>
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
            {(Object.values(link.subLinks) as (FlatLink | MultipleLink)[]).map(
              (subLink) => {
                const isActive =
                  subLink.type === "multiple"
                    ? Object.values(subLink.paths).find((p) =>
                        pathname.startsWith(p),
                      )
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
              },
            )}
          </AccordionContent>
        )}
      </AccordionItem>
    </>
  );
}
