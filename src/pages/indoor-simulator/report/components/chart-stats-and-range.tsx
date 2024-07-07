import { CircularProgressBar } from "@/components/circular-progress-bar";
import { GraphRevenueCell } from "@/pages/indoor-simulator/report/components/graph-revenue-cell";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { ReportInterval } from "@/types-and-schemas/report";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import x from "@/assets/x-sm.svg";

export function ChartStatsAndRange({
  setMonth,
  setYear,
  setDay,
  lastDateSetBy,
  setLastDateSetBy,
  date,
  setDate,
}: {
  setMonth(): void;
  setYear(): void;
  setDay(): void;
  lastDateSetBy: ReportInterval;
  setLastDateSetBy: (x: ReportInterval) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  return (
    <div className="flex gap-2.5">
      <GraphRevenueCell title="總營業額" amount={23400000} />
      <GraphRevenueCell
        title="6月營業額"
        amount={1100000}
        leftSlot={<CircularProgressBar size={60} filledPercentage={60} />}
      />
      <div className="ml-auto flex flex-col items-end gap-2.5">
        <div className="flex gap-1.5 text-sm">
          <TextButton onClick={setDay} selected={lastDateSetBy === "day"}>
            日
          </TextButton>
          <TextButton onClick={setMonth} selected={lastDateSetBy === "month"}>
            月
          </TextButton>
          <TextButton onClick={setYear} selected={lastDateSetBy === "year"}>
            年
          </TextButton>
          <DateRangePicker
            date={date}
            setDate={setDate}
            setLastDateIsSetByRangePicker={() =>
              setLastDateSetBy("range-picker")
            }
            selected={lastDateSetBy === "range-picker"}
          />
        </div>
        {lastDateSetBy === "range-picker" && (
          <p className="flex items-center gap-1 rounded-full border border-line-gray bg-light-gray px-2.5 py-1 text-sm">
            <span>
              {date && date.from && format(date.from, "yyyy/MM/dd")}~
              {date && date.to && format(date.to, "yyyy/MM/dd")}
            </span>
            <button
              className="grid size-4 place-items-center rounded-full bg-word-gray"
              onClick={setMonth}
            >
              <img src={x} />
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
