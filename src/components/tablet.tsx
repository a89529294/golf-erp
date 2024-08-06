import { cn } from "@/lib/utils";
import React from "react";

export function Tablet({ active, value }: { active: boolean; value: string }) {
  return (
    <div
      className={cn(
        "flex h-5 w-10 items-center justify-center rounded-full border text-sm font-medium",
        active
          ? "border-secondary-purple text-secondary-purple"
          : "border-line-red text-word-red",
      )}
    >
      {value}
    </div>
  );
}

export const TabletSendPoints = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(function ({ className, ...rest }, ref) {
  return (
    <button
      className={cn(
        "flex h-5 items-center justify-center whitespace-nowrap rounded-full border border-green-500 px-1 text-sm font-medium text-green-500",
        className,
      )}
      ref={ref}
      {...rest}
    >
      贈送點數
    </button>
  );
});
