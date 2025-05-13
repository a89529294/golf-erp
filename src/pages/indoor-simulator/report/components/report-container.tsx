// import x from "@/assets/x-sm.svg";
import { ChartStatsAndRange } from "@/pages/indoor-simulator/report/components/chart-stats-and-range";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MainChart } from "@/pages/indoor-simulator/report/components/main-chart";
import { RightPanel } from "@/pages/indoor-simulator/report/components/right-panel";
import { SitesList } from "@/pages/indoor-simulator/report/components/sites-list";
import { SwitchButton } from "@/pages/indoor-simulator/report/components/switch-button";
import { TopUpSectionWrapper } from "@/pages/indoor-simulator/report/components/top-up-section-wrapper";
import { ReportData } from "@/pages/indoor-simulator/report/loader";
import { DataType } from "@/types-and-schemas/report";
import { formatDateAsString, updateSearchParams } from "@/utils";
import { lastDayOfMonth } from "date-fns";
import React from "react";
import { useSearchParams } from "react-router-dom";

export function ReportContainer({
  data,
  stores,
}: {
  data: ReportData;
  stores: { id: string; name: string; merchantId: string }[];
}) {
  const [activeDataType, setActiveDataType] =
    React.useState<DataType>("revenue");
  const [, setSearchParams] = useSearchParams();
  const [rightPanelHeight, setRightPanelHeight] = React.useState(0);
  const rightPanelRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!rightPanelRef.current) return;

    setRightPanelHeight(rightPanelRef.current.clientHeight);
  }, []);

  const setDay = () => {
    updateSearchParams({
      setSearchParams,
      key: "range",
      value: `${formatDateAsString(new Date())}:${formatDateAsString(new Date())}`,
    });
  };
  const setMonth = () => {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    updateSearchParams({
      setSearchParams,
      key: "range",
      value: `${formatDateAsString(firstDayOfMonth)}:${formatDateAsString(lastDayOfMonth(new Date()))}`,
    });
  };
  const setYear = () => {
    const date = new Date();

    updateSearchParams({
      setSearchParams,
      key: "range",
      value: `${formatDateAsString(new Date(date.getFullYear(), 0, 1))}:${formatDateAsString(new Date(date.getFullYear() + 1, 0, 0))}`,
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <nav className="space-x-3 self-center bg-transparent">
        <SwitchButton
          value="revenue"
          activeDataType={activeDataType}
          setActiveDataType={setActiveDataType}
        >
          總營業額
        </SwitchButton>
        <SwitchButton
          value="appointment"
          activeDataType={activeDataType}
          setActiveDataType={setActiveDataType}
        >
          總訂單數
        </SwitchButton>
      </nav>
      <div className="grid grid-cols-[1fr_auto] gap-x-2.5 gap-y-6">
        {data && (
          <>
            {!!rightPanelHeight && (
              <div
                // style={{ height: rightPanelHeight }}
                className="flex flex-1 flex-col gap-2 rounded-md bg-white p-4"
              >
                <ChartStatsAndRange
                  setDay={setDay}
                  setMonth={setMonth}
                  setYear={setYear}
                  data={data}
                  activeDataType={activeDataType}
                />
                <div className="flex-1">
                  {data && (
                    <MainChart
                      data={data}
                      rightPanelHeight={rightPanelHeight}
                      activeDataType={activeDataType}
                    />
                  )}
                </div>
              </div>
            )}
            <RightPanel ref={rightPanelRef} data={data} />
            <TopUpSectionWrapper data={data} />
            <SitesList data={data} stores={stores} />
          </>
        )}
      </div>
    </div>
  );
}
