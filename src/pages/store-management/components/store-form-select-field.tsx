import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { storeCategoryMap } from "@/utils";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { formSchema } from "../schemas";

export function StoreFormSelectField({
  form,
  name,
  label,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: Exclude<keyof z.infer<typeof formSchema>, "employees" | "chargeImages">;
  label: string;
  disabled: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline ">
            <FormLabel className="w-28">{label}</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              // @ts-ignore
              defaultValue={field.value ?? ""}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "flex-1 rounded-none border-0 border-b border-b-secondary-dark p-1",
                    field.value && "border-b-orange",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(storeCategoryMap).map(([key, label]) => (
                  <SelectItem value={key} key={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
