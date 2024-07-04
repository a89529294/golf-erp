import { cn } from "@/lib/utils";
import React from "react";

export const TextButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    onClick?: () => void;
    selected?: boolean;
    className?: string;
  }
>(function TB({ children, onClick = () => {}, selected, className }, ref) {
  return (
    <button
      className={cn(
        "self-start border border-line-gray bg-light-gray px-1.5",
        selected && "bg-secondary-dark text-white",
        className,
      )}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});
