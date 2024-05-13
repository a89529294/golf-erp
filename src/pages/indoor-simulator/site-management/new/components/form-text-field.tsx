import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { useFormContext } from "react-hook-form";

export function FormTextField({
  name,
  label,
}: {
  name: "name" | "description";
  label: string;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-baseline gap-5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder={`請輸入${label}`}
              className="h-7 p-0 pb-1"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
