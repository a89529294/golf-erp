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
  sameRouteGroup,
} from "@/utils/links";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigation } from "react-router-dom";

export function Sidebar() {
  const { pathname } = useLocation();
  const prevLink = usePrevious(findLinkFromPathname(pathname));
  const [nextLinkPath, setNextLinkPath] = useState("");
  const [nestedLinksClosed, setNestedLinksClosed] = useState(false);
  const { user } = useAuth();

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
      defaultValue={(() => {
        const linkOnMount = findLinkFromPathname(pathname);
        if (!linkOnMount) return undefined;

        return linkOnMount.type === "nested"
          ? linkOnMount.path
          : linkOnMount.paths.index;
      })()}
    >
      {isLinkAllowed(linksKV["driving-range"]) && (
        <AccordionItemWrapper
          link={linksKV["driving-range"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
          nextLinkPath={nextLinkPath}
          setNextLinkPath={setNextLinkPath}
        />
      )}
      {isLinkAllowed(linksKV["golf"]) && (
        <AccordionItemWrapper
          link={linksKV["golf"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
          nextLinkPath={nextLinkPath}
          setNextLinkPath={setNextLinkPath}
        />
      )}
      {isLinkAllowed(linksKV["indoor-simulator"]) && (
        <AccordionItemWrapper
          link={linksKV["indoor-simulator"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
          nextLinkPath={nextLinkPath}
          setNextLinkPath={setNextLinkPath}
        />
      )}
      {isLinkAllowed(linksKV["system-management"]) && (
        <AccordionItemWrapper
          link={linksKV["system-management"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
          nextLinkPath={nextLinkPath}
          setNextLinkPath={setNextLinkPath}
        />
      )}
      {isLinkAllowed(linksKV["store-management"]) && (
        <AccordionItemWrapper
          link={linksKV["store-management"]}
          prevLink={prevLink}
          nestedLinksClosed={nestedLinksClosed}
          setNestedLinksClosed={setNestedLinksClosed}
          nextLinkPath={nextLinkPath}
          setNextLinkPath={setNextLinkPath}
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
  link: NestedLink | MultipleLink;
  prevLink: NestedLink | MultipleLink | undefined;
  nestedLinksClosed: boolean;
  setNestedLinksClosed: Dispatch<SetStateAction<boolean>>;
  setNextLinkPath: Dispatch<SetStateAction<string>>;
  nextLinkPath: string | null;
}) {
  const { pathname } = useLocation();
  const state = useNavigation();
  const [inSameRouteGroup, setInSameRouteGroup] = useState(false);

  const getPath = (link: NestedLink | MultipleLink) =>
    link.type === "nested" ? link.basePath : link.paths.index;

  const isLinkActive = (link: NestedLink | MultipleLink) => {
    if (prevLink && isBelowLink(getPath(prevLink), pathname ?? "")) {
      return pathname.startsWith(getPath(link)) && nestedLinksClosed;
    }

    return pathname.startsWith(getPath(link));
  };

  useEffect(() => {
    if (state.state === "idle") setInSameRouteGroup(false);
  }, [inSameRouteGroup, state.state]);

  const path = link.type === "nested" ? link.path : link.paths.index;

  return (
    <AccordionItem value={path} className="overflow-hidden">
      <AccordionTrigger asChild>
        <NavLink to={path} className="group relative block py-3 pl-7">
          {({ isPending }) => (
            <>
              <div
                className={cn(
                  "flex w-full items-center justify-between pr-4 transition-colors",
                  isLinkActive(link) &&
                    state.state !== "loading" &&
                    "text-white",
                )}
              >
                {link.label}
                {link.type === "nested" && (
                  <ChevronDown className="transition-transform duration-300 group-data-[state=closed]:-rotate-180" />
                )}
              </div>

              {isLinkActive(link) &&
                (inSameRouteGroup ? (
                  <motion.div
                    className="absolute inset-0 -z-10 bg-secondary-dark"
                    layoutId="link-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.01, delay: 0.1 }}
                  />
                ) : (
                  <motion.div
                    className="absolute inset-0 -z-10 bg-secondary-dark"
                    layoutId="link-bg"
                  />
                ))}
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
          className="flex flex-col bg-white pt-1"
          onAnimationEnd={() => {
            if (!pathname.startsWith(link.path)) setNestedLinksClosed(true);
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
                subLink.type === "multiple"
                  ? Object.values(subLink.paths)[0]
                  : subLink.path;

              return (
                <NavLink
                  to={path}
                  className={() => {
                    let base =
                      "relative py-2.5 pl-10 text-sm transition-colors ";
                    base +=
                      isActive && state.state !== "loading" ? "text-white" : "";
                    return base;
                  }}
                  key={path}
                  onClick={() => {
                    setInSameRouteGroup(
                      sameRouteGroup(location.pathname, path),
                    );
                  }}
                >
                  {({ isPending }) => (
                    <>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0  border-l-[3px] border-secondary-dark bg-orange"
                          layoutId="nested-link-bg"
                        />
                      )}
                      {isPending && (
                        <motion.div
                          className="absolute inset-0  border-l-[3px] border-secondary-dark bg-orange/50"
                          layoutId="nested-link-bg"
                        />
                      )}
                      <div className="relative">{subLink.label}</div>
                    </>
                  )}
                </NavLink>
              );
            },
          )}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}
