"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/original-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";

export function DateRangePicker({
  className,
  date,
  setDate,
  setLastDateIsSetByRangePicker,
  selected,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setLastDateIsSetByRangePicker: () => void;
  selected: boolean;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <TextButton selected={selected}>指定範圍</TextButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(e) => {
              if (e?.from && e?.to) setLastDateIsSetByRangePicker();
              setDate(e);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
