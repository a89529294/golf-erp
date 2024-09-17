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
import { formatDateAsString } from "@/utils";

export function DateRangePicker({
  className,
  setRange,
  setLastDateIsSetByRangePicker,
  selected,
}: React.HTMLAttributes<HTMLDivElement> & {
  setRange: (rangeString: string) => void;
  setLastDateIsSetByRangePicker: () => void;
  selected: boolean;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <TextButton selected={selected} className="whitespace-nowrap">
            指定範圍
          </TextButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(e) => {
              if (e?.from && e?.to) {
                setLastDateIsSetByRangePicker();

                setRange(
                  `${formatDateAsString(e.from)}:${formatDateAsString(e.to)}`,
                );
              }
              setDate(e);
            }}
            numberOfMonths={2}
            max={360}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
