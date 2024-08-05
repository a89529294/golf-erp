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

export function TimeFormField({ disabled }: { disabled?: boolean }) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem className={cn("grid grid-cols-[1fr_415px] items-baseline")}>
          <FormLabel>時段</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder="時段"
              {...field}
              className={cn("h-8 justify-center p-1")}
              disabled={disabled}
              type="time"
            />
          </FormControl>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
