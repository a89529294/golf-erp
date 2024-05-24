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
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: Exclude<keyof z.infer<typeof formSchema>, "employees">;
  label: string;
  disabled: boolean;
  asNumber?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-5">
            <FormLabel className="w-16">{label}</FormLabel>
            <FormControl>
              <Input
                className={cn(
                  "h-7 w-96 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                  field.value && "border-b-orange",
                )}
                placeholder={`請輸入${label}`}
                {...field}
                disabled={disabled}
                inputMode={asNumber ? "decimal" : "text"}
                type={asNumber ? "number" : "text"}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
