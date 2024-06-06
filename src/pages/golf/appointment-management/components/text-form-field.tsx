import { FieldPath, useFormContext } from "react-hook-form";
import { formSchema } from "..";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { z } from "zod";

export function TextFormField({
  label,
  name,
  placeholder,
  className,
  textLeft,
  disabled,
}: {
  label?: string;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder?: string;
  className?: string;
  textLeft?: boolean;
  disabled?: boolean;
}) {
  const form = useFormContext();
  if (!placeholder) placeholder = label;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("grid grid-cols-[1fr_415px] items-baseline", className)}
        >
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder={placeholder}
              {...field}
              className={cn("h-8 p-1", textLeft ? "text-left" : "text-center")}
              disabled={disabled}
            />
          </FormControl>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
