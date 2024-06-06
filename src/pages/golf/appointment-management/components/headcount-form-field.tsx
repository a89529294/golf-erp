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

export function HeadcountFormField({ disabled }: { disabled?: boolean }) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="headcount"
      render={({ field }) => (
        <FormItem className={cn("grid grid-cols-[1fr_415px] items-baseline")}>
          <FormLabel>人數</FormLabel>
          <FormControl>
            <UnderscoredInput
              {...field}
              className={cn("h-8 p-1 text-center")}
              type="number"
              placeholder="人數"
              disabled={disabled}
            />
          </FormControl>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
