// import x from "@/assets/x-sm.svg";
import { ChartStatsAndRange } from "@/pages/indoor-simulator/report/components/chart-stats-and-range";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MainChart } from "@/pages/indoor-simulator/report/components/main-chart";
import { RightPanel } from "@/pages/indoor-simulator/report/components/right-panel";
import { SiteSection } from "@/pages/indoor-simulator/report/components/site-section";
import { SwitchButton } from "@/pages/indoor-simulator/report/components/switch-button";
import { ReportInterval } from "@/types-and-schemas/report";
import { addDays } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
// import { useSearchParams } from "react-router-dom";

export function ReportContainer() {
  // const [searchParams] = useSearchParams();
  const [rightPanelHeight, setRightPanelHeight] = React.useState(0);
  const rightPanelRef = React.useRef<HTMLDivElement>(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [lastDateSetBy, setLastDateSetBy] =
    React.useState<ReportInterval>("month");

  React.useLayoutEffect(() => {
    if (!rightPanelRef.current) return;

    setRightPanelHeight(rightPanelRef.current.clientHeight);
  }, []);

  const setDay = () => {
    setDate({ from: new Date(), to: new Date() });
    setLastDateSetBy("day");
  };
  const setMonth = () => {
    const date = new Date();
    setDate({
      from: new Date(date.getFullYear(), date.getMonth(), 1),
      to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
    setLastDateSetBy("month");
  };
  const setYear = () => {
    const date = new Date();
    setDate({
      from: new Date(date.getFullYear(), 0, 1),
      to: new Date(date.getFullYear() + 1, 0, 0),
    });
    setLastDateSetBy("year");
  };

  return (
    <div className="flex flex-col gap-2.5">
      <nav className="space-x-3 self-center bg-transparent">
        <SwitchButton activeValue="revenue">總營業額</SwitchButton>
        <SwitchButton activeValue="order">總訂單數</SwitchButton>
      </nav>
      <div className="grid grid-cols-[1fr_auto] gap-x-2.5 gap-y-6">
        {rightPanelHeight && (
          <div
            style={{ height: rightPanelHeight }}
            className="flex flex-1 flex-col gap-2 rounded-md bg-white p-4"
          >
            <ChartStatsAndRange
              setDay={setDay}
              setMonth={setMonth}
              setYear={setYear}
              setLastDateSetBy={setLastDateSetBy}
              lastDateSetBy={lastDateSetBy}
              date={date}
              setDate={setDate}
            />
            <div className="flex-1">
              <MainChart rightPanelHeight={rightPanelHeight} />
            </div>
          </div>
        )}
        <RightPanel ref={rightPanelRef} />
        <SiteSection title="A包廂" />
        <SiteSection title="B包廂" />
      </div>
    </div>
  );
}
