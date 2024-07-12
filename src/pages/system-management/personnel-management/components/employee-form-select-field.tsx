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
import { formSchema } from "@/pages/system-management/personnel-management/components/schemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function EmployeeFormSelectField({
  form,
  name,
  label,
  options,
  disabled,
  onChange,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  options: Record<string, string>;
  disabled: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-baseline gap-7">
              <FormLabel>{label}</FormLabel>
              <Select
                disabled={disabled}
                onValueChange={(v) => {
                  if (v === "reset") {
                    // setSelectKey(selectKey + 1);
                    field.onChange("");
                    onChange && onChange("");
                  } else {
                    field.onChange(v);
                    onChange && onChange(v);
                  }
                }}
                value={field.value}
                // key={selectKey}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark text-left focus:border-b-[1.5px] focus:border-b-orange sm:w-40",
                      field.value && "border-b-orange",
                    )}
                  >
                    <SelectValue placeholder={`選擇${label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(options).map(([value, label]) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
