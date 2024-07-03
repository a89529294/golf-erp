import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export function FormTextField({
  name,
  label,
  disabled,
  className,
}: {
  name: "name" | "description" | "code";
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "grid grid-cols-[auto_1fr] items-baseline gap-x-5",
            className,
          )}
        >
          <FormLabel className="">{label}</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder={`請輸入${label}`}
              className="h-7 p-0 pb-1"
              disabled={disabled}
              {...field}
            />
          </FormControl>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
