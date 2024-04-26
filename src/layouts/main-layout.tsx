import { UserDisplayLogout } from "@/components/user-display-logout";
import { ReactNode } from "react";

export function MainLayout({
  headerChildren,
  children,
}: {
  headerChildren: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-full flex-col px-2.5">
      <header className="sticky top-0 z-10 flex h-20 flex-shrink-0 items-end gap-2.5 bg-white pb-[1.5px]">
        {headerChildren}

        <UserDisplayLogout />
      </header>
      <div className="sticky top-20 z-10 h-2.5 bg-white" />
      <div className="flex flex-1 ">{children}</div>
    </div>
  );
}
