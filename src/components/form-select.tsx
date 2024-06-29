import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export function FormSelect<T extends Record<string, string>>({
  name,
  label,
  labeClassName,
  formItemClass,
  disabled,
  placeholder,
  options,
  optionKey,
  optionValue,
  onValueChange,
}: {
  name: string;
  label?: string;
  labeClassName?: string;
  formItemClass: string;
  disabled: boolean;
  placeholder: string;
  options: T[] | undefined;
  optionKey: keyof T;
  optionValue: keyof T;
  onValueChange?: () => void;
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClass}>
          {label && (
            <FormLabel className={cn("w-20", labeClassName)}>{label}</FormLabel>
          )}
          <Select
            disabled={disabled}
            onValueChange={(v) => {
              if (v === "") return;
              field.onChange(v);
              onValueChange && onValueChange();
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-[186px] rounded-none border-0 border-b border-b-secondary-dark p-1",
                  field.value && "border-b-orange",
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72">
              {options?.map((option) => (
                <SelectItem value={option[optionKey]} key={option[optionKey]}>
                  {option[optionValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
