import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formSchema } from "@/pages/system-management/personnel-management/components/schemas";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function EmployeeFormField({
  form,
  name,
  label,

  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;

  disabled: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-baseline gap-7">
              <FormLabel required>{label}</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-40",
                    field.value && "border-b-orange",
                  )}
                  placeholder={`請輸入${label}`}
                  {...field}
                  disabled={disabled}
                  onChange={(e) => {
                    field.onChange(e);
                    form.clearErrors(name);
                  }}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
