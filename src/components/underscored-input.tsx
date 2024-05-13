import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef, useState } from "react";

() => {
  return (
    <Input className={cn("rounded-none border-0 border-b border-orange")} />
  );
};

export const UnderscoredInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof Input>
>(({ className, onBlur, onFocus, ...rest }, ref) => {
  const [thickBorder, setThickBorder] = useState(false);

  return (
    <Input
      ref={ref}
      className={cn(
        "rounded-none border-0 border-b border-secondary-dark focus:border-orange",
        thickBorder && "border-b-[1.5px] border-orange",
        className,
      )}
      onBlur={(e) => {
        setThickBorder(!!e.currentTarget.value);
        onBlur && onBlur(e);
      }}
      onFocus={(e) => {
        setThickBorder(false);
        onFocus && onFocus(e);
      }}
      {...rest}
    />
  );
});
