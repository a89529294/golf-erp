import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefObject } from "react";
import { Path, useFormContext } from "react-hook-form";
import { z } from "zod";
import { memberFormSchema } from "../schemas";

export function FormSelect({
  name,
  optionMap,
  myRef,
  disabled,
}: {
  name: Path<z.infer<typeof memberFormSchema>>;
  optionMap: Record<string, string>;
  myRef: RefObject<HTMLButtonElement>;
  disabled: boolean;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                ref={myRef}
                className="rounded-none border-0 border-b border-secondary-dark bg-transparent px-1 pb-1"
                disabled={disabled}
              >
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(optionMap).map(([value, label]) => {
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
