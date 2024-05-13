"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  date,
  setDate,
  error,
  clearError,
  fromDate,
  toDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  error: boolean;
  clearError: () => void;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
}) {
  const [open, setOpen] = React.useState(false);

  const minguoDate = date
    ? `${date.getFullYear() - 1911}-${date.getMonth() + 1}-${date.getDate()}`
    : "";

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
            "flex h-7 w-44 items-center border-b border-secondary-dark text-secondary-dark",
            !date && "text-word-gray",
            error && "border-b-destructive",
          )}
        >
          <span className="flex-1">
            {date ? minguoDate : <span>日期</span>}
          </span>
          <CalendarIcon className="h-4 w-4 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          onDaySelect={() => setOpen(false)}
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
}
