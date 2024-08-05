import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

export function AppointmentDatePicker({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="grid grid-cols-[1fr_415px] items-baseline">
          <FormLabel>日期</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  className={cn(
                    "relative h-8 items-center border-b border-secondary-dark text-center disabled:cursor-not-allowed disabled:opacity-50",
                    !field.value && "text-word-gray",
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "yyyy/MM/dd")
                  ) : (
                    <span>日期</span>
                  )}
                  <CalendarIcon className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-dark" />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                // disabled={(date) =>
                //   date > new Date() || date < new Date("1900-01-01")
                // }
                initialFocus
                onDaySelect={() => setOpen(false)}
              />
            </PopoverContent>
          </Popover>

          <FormMessage className="col-start-2" />
        </FormItem>
      )}
    />
  );
}
