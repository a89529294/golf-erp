import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { memberFormSchema } from "@/pages/member-management/members/schemas";
import { Path, useFormContext } from "react-hook-form";
import { z } from "zod";

export function UnderScoredFormInput({
  name,
  placeholder,
  disabled,
  type,
}: {
  name: Path<z.infer<typeof memberFormSchema>>;
  placeholder?: string;
  disabled: boolean;
  type?: HTMLInputElement["type"];
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <UnderscoredInput
              placeholder={placeholder}
              className="w-full px-1 pb-1"
              id={name}
              disabled={disabled}
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
