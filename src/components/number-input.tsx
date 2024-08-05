import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps, RefObject } from "react";

type NumberInputProps = ComponentProps<"input"> & {
  myRef?: RefObject<HTMLInputElement>;
};

export function NumberInput({
  className,
  myRef,
  value,
  ...props
}: NumberInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        className={cn(
          "peer w-36 border-2 border-line-gray bg-light-gray text-center focus:border-orange disabled:border-0 disabled:opacity-100 sm:w-20",
          className,
        )}
        ref={myRef}
        value={value}
        // onFocus={() => {
        //   setFocused(true);
        // }}
        // onBlur={(e) => {
        //   onBlur && onBlur(e);
        //   setFocused(false);
        // }}
        {...props}
      />
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {new Intl.NumberFormat().format(value ? +value : 0)}
        {focused && <span className="animate-blink">│</span>}
      </div> */}
    </div>
  );
}
