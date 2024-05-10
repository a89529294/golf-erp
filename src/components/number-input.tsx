import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps, RefObject } from "react";

type NumberInputProps = ComponentProps<"input"> & {
  myRef: RefObject<HTMLInputElement>;
};

export function NumberInput({
  className,
  myRef,
  value,
  ...props
}: NumberInputProps) {
  return (
    <Input
      type="text"
      className={cn(
        "w-36 border-2 border-line-gray bg-light-gray text-center focus:border-orange disabled:border-0 disabled:opacity-100",
        className,
      )}
      ref={myRef}
      value={new Intl.NumberFormat().format(value ? +value : 0)}
      {...props}
    />
  );
}
