import x from "@/assets/x-sm.svg";
import { CircularProgressBar } from "@/components/circular-progress-bar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { GraphRevenueCell } from "@/pages/indoor-simulator/report/components/graph-revenue-cell";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { ReportData } from "@/pages/indoor-simulator/report/loader";
import { DataType, reportTimeRange } from "@/types-and-schemas/report";
import { fromRangeStringToLastDateSetBy, updateSearchParams } from "@/utils";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

export function ChartStatsAndRange({
  setMonth,
  setYear,
  setDay,
  data,
  activeDataType,
}: {
  setMonth(): void;
  setYear(): void;
  setDay(): void;
  data: ReportData;
  activeDataType: DataType;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get("range")! as reportTimeRange;
  const isYearData = fromRangeStringToLastDateSetBy(range) === "year";
  const isMonthData = fromRangeStringToLastDateSetBy(range) === "month";
  const isDayData = fromRangeStringToLastDateSetBy(range) === "day";
  const isCustomData = fromRangeStringToLastDateSetBy(range) === "range-picker";
  const date = range
    ? {
        from: new Date(range.split(":")[0]),
        to: new Date(range.split(":")[1]),
      }
    : undefined;
  const totalRevenue = data.total.totalAmount;
  const totalAppointmentCount = data.total.totalCount;

  const yearTotalRevenue = Object.values(data.year).reduce(
    (acc, v) => acc + (v.totalAmount ?? 0),
    0,
  );
  const yearTotalAppointments = Object.values(data.year).reduce(
    (acc, v) => acc + v.totalCount,
    0,
  );
  const rangeTotalRevenue = Object.values(data.detailed).reduce(
    (acc, v) => acc + (v.totalAmount ?? 0),
    0,
  );
  const rangeTotalAppointments = Object.values(data.detailed).reduce(
    (acc, v) => acc + v.totalCount,
    0,
  );
  const percentage = Math.round(
    (() => {
      if (totalRevenue === 0) return 0;
      if (totalAppointmentCount === 0) return 0;

      if (activeDataType === "revenue") {
        if (isYearData) return yearTotalRevenue / totalRevenue;
        return rangeTotalRevenue / totalRevenue;
      } else {
        if (isYearData) return yearTotalAppointments / totalAppointmentCount;
        return rangeTotalAppointments / totalAppointmentCount;
      }
    })() * 100,
  );

  function setRange(rangeString: string) {
    updateSearchParams({
      setSearchParams,
      key: "range",
      value: rangeString,
    });
  }

  const obj = {
    revenue: {
      year: new Date().getFullYear() + "營業額",
      month: new Date().getMonth() + 1 + "月營業額",
      day: new Date().getDate() + "日營業額",
      custom: `指定範圍營業額`,
    },
    appointment: {
      year: new Date().getFullYear() + "訂單數",
      month: new Date().getMonth() + 1 + "月訂單數",
      day: new Date().getDate() + "日訂單數",
      custom: `指定範圍訂單數`,
    },
  };

  const title = (() => {
    const o = obj[activeDataType];
    if (isYearData) return o["year"];
    if (isMonthData) return o["month"];
    if (isDayData) return o["day"];
    return o["custom"];
  })();

  return (
    <div className="flex gap-2.5">
      <GraphRevenueCell
        title={activeDataType === "revenue" ? "總營業額" : "總訂單數"}
        amount={
          activeDataType === "revenue" ? totalRevenue : totalAppointmentCount
        }
      />
      <GraphRevenueCell
        title={title}
        amount={
          activeDataType === "revenue"
            ? rangeTotalRevenue
            : rangeTotalAppointments
        }
        leftSlot={
          <CircularProgressBar size={60} filledPercentage={percentage} />
        }
      />
      <div className="ml-auto flex flex-col items-end gap-2.5">
        <div className="flex gap-1.5 text-sm">
          <TextButton onClick={setDay} selected={isDayData}>
            日
          </TextButton>
          <TextButton onClick={setMonth} selected={isMonthData}>
            月
          </TextButton>
          <TextButton onClick={setYear} selected={isYearData}>
            年
          </TextButton>
          <DateRangePicker
            setRange={setRange}
            setLastDateIsSetByRangePicker={() => {}}
            selected={isCustomData}
          />
        </div>
        {isCustomData && (
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
