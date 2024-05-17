import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Props = ComponentProps<"label"> & {
  inputProps?: ComponentProps<"input">;
  label: string;
};

export function LabeledUnderscoredInput({
  label,
  className,
  inputProps = {},
  ...rest
}: Props) {
  const { className: inputClassName, ...inputRest } = inputProps;
  return (
    <label className={cn("flex items-center gap-1.5", className)} {...rest}>
      <span>{label}</span>
      <UnderscoredInput
        className={cn("flex-1 basis-0 text-center", inputClassName)}
        {...inputRest}
      />
    </label>
  );
}
