import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { useFormContext } from "react-hook-form";

export function FeeFormField({ disabled }: { disabled?: boolean }) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={"price"}
      render={({ field }) => (
        <FormItem className="relative grid grid-cols-[1fr_415px] items-baseline sm:grid-cols-[80px_1fr]">
          <FormLabel>費用</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder="費用"
              {...field}
              className="col-start-2 row-start-1 h-8 w-[395px] p-1 text-center sm:w-auto"
              type="number"
              disabled={disabled}
            />
          </FormControl>
          <span className="absolute right-0 col-start-2 row-start-1 w-fit translate-y-1">
            元
          </span>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
