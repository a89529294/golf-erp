import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export function BirthDayDatePicker({ disabled }: { disabled: boolean }) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="birthday"
      render={({ field }) => (
        <FormItem className="flex h-10 flex-1 flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  className={cn(
                    "flex h-full items-end  border-b border-secondary-dark pb-1 pl-1 text-left font-normal disabled:cursor-not-allowed disabled:opacity-50",
                    !field.value && "text-word-gray",
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "yyyy-MM-dd")
                  ) : (
                    <span>生日</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 text-secondary-dark " />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                onDaySelect={() => setOpen(false)}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
