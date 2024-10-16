// import { UserDisplayLogout } from "@/components/user-display-logout";
import { ReactNode, useEffect, useRef, useState } from "react";

export function MainLayout({
  headerChildren,
  children,
}: {
  headerChildren?: ReactNode;
  children: ReactNode | (({ height }: { height: number }) => ReactNode);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    function setHeight() {
      if (!container) return;
      setContainerHeight(container.clientHeight);
    }

    setHeight();

    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div className="relative isolate -mr-[358px] flex min-h-full w-full flex-col px-2.5 sm:-mr-0">
      <header className="sticky top-0 z-10 flex h-20 flex-shrink-0 items-end gap-2.5 bg-white pb-[1.5px]">
        {headerChildren}
        {/* <UserDisplayLogout /> */}
      </header>
      <div className="sticky top-20 z-10 h-2.5 bg-white" />
      <div className="relative flex flex-1" ref={ref}>
        {containerHeight > 0
          ? typeof children === "function"
            ? children({ height: containerHeight })
            : children
          : null}
      </div>
    </div>
  );
}
