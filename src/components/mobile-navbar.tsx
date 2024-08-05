import { Sidebar } from "@/components/sidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import React from "react";

export function MobileNavbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="fixed hidden left-1 top-1 sm:block">
        <ChevronRight />
      </SheetTrigger>
      <SheetContent side="left" className="hidden p-0 sm:block">
        <VisuallyHidden.Root>
          <SheetTitle>side navbar</SheetTitle>
        </VisuallyHidden.Root>
        <Sidebar className="" onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
