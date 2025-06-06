import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schemas";

export function StoreFormField({
  form,
  name,
  label,
  disabled,
  asNumber,
  labelClassName,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: Exclude<keyof z.infer<typeof formSchema>, "employees" | "chargeImages">;
  label: string;
  disabled: boolean;
  asNumber?: boolean;
  labelClassName?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="grid grid-cols-[auto_1fr] items-baseline gap-y-1 sm:grid-cols-1">
            <FormLabel className={cn("w-28", labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              {/* @ts-ignore */}
              <Input
                className={cn(
                  "h-7 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                  field.value && "border-b-orange",
                )}
                placeholder={`請輸入${label}`}
                {...field}
                disabled={disabled}
                inputMode={asNumber ? "decimal" : "text"}
                type={asNumber ? "number" : "text"}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors(name);
                }}
              />
            </FormControl>

            <FormMessage className="col-start-2 sm:col-start-1" />
          </FormItem>
        );
      }}
    />
  );
}
