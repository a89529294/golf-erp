import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  disabledClassNames?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabledClassNames, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-word-gray focus-visible:outline-none disabled:cursor-not-allowed ",
          className,
          disabledClassNames !== undefined
            ? disabledClassNames
            : "disabled:opacity-50",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
