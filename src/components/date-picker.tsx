import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toMinguoDate } from "@/utils";

export function DatePicker({
  date,
  setDate,
  error,
  clearError,
  fromDate,
  toDate,
  onEdit,
  disabled,
}: {
  date: Date | undefined;
  setDate: (e: Date | undefined) => void;
  error: boolean;
  clearError: () => void;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  onEdit: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        clearError();
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-7 w-44 items-center border-b border-secondary-dark text-secondary-dark sm:w-32",
            !date && "text-word-gray",
            error && "border-b-destructive",
            disabled && "cursor-not-allowed",
          )}
          onClick={() => {
            onEdit();
          }}
          disabled={disabled}
        >
          <span className="flex-1">
            {date ? toMinguoDate(date) : <span>日期</span>}
          </span>
          <CalendarIcon className="h-4 w-4 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => {
            if (e) e.setHours(8);
            setDate(e);
          }}
          initialFocus
          onDaySelect={() => setOpen(false)}
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
}
