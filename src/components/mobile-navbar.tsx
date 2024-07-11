import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import React from "react";

export function MobileNavbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="fixed left-1 top-1 hidden sm:block">
        <ChevronRight />
      </SheetTrigger>
      <SheetContent side="left" className="hidden p-0 sm:block">
        <Sidebar className="" onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
