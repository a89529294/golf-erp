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

  const totalFee = data.total.orders.reduce(
    (acc, val) => {
      if (
        val.paymentMethod === "台灣發卡機構核發之信用卡" ||
        val.paymentMethod === "ApplePay"
      ) {
        return {
          newebPay: acc.newebPay + Math.ceil(val.amount * 0.028),
          linePay: acc.linePay,
          JKOPAY: acc.JKOPAY,
        };
      }

      if (val.paymentMethod === "line-pay") {
        return {
          linePay: acc.linePay + Math.ceil(val.amount * 0.0315),
          newebPay: acc.newebPay,
          JKOPAY: acc.JKOPAY,
        };
      }

      if (val.paymentMethod === "JKOPAY") {
        return {
          linePay: acc.linePay,
          newebPay: acc.newebPay,
          JKOPAY: acc.JKOPAY + Math.ceil(val.amount * 0.025),
        };
      }

      return acc;
    },
    {
      newebPay: 0,
      linePay: 0,
      JKOPAY: 0,
    },
  );

  const totalAppointmentCount = data.total.totalCount;

  const yearTotalRevenue = Object.values(data.year).reduce(
    (acc, v) => acc + (v.totalAmount ?? 0),
    0,
  );

  const yearlyFee = Object.values(data.year).reduce(
    (acc, val) => {
      const monthlyFee = val.orders.reduce(
        (a, v) => {
          if (
            v.paymentMethod === "ApplePay" ||
            v.paymentMethod === "台灣發卡機構核發之信用卡"
          ) {
            return {
              np: a.np + Math.ceil(v.amount * 0.028),
              lp: a.lp,
              jp: a.jp,
            };
          }

          if (v.paymentMethod === "line-pay") {
            return {
              np: a.np,
              lp: a.lp + Math.ceil(v.amount * 0.0315),
              jp: a.jp,
            };
          }

          if (v.paymentMethod === "JKOPAY") {
            return {
              np: a.np,
              lp: a.lp,
              jp: a.jp + Math.ceil(v.amount * 0.025),
            };
          }

          return a;
        },
        {
          np: 0,
          lp: 0,
          jp: 0,
        },
      );

      return {
        newebPay: acc.newebPay + monthlyFee.np,
        linePay: acc.linePay + monthlyFee.lp,
        JKOPAY: acc.JKOPAY + monthlyFee.jp,
      };
    },
    {
      newebPay: 0,
      linePay: 0,
      JKOPAY: 0,
    },
  );

  const yearTotalAppointments = Object.values(data.year).reduce(
    (acc, v) => acc + v.totalCount,
    0,
  );
  const rangeTotalRevenue = Object.values(data.detailed).reduce(
    (acc, v) => acc + (v.totalAmount ?? 0),
    0,
  );

  const rangeFee = Object.values(data.detailed).reduce(
    (acc, val) => {
      const monthlyFee = val.orders.reduce(
        (a, v) => {
          if (
            v.paymentMethod === "ApplePay" ||
            v.paymentMethod === "台灣發卡機構核發之信用卡"
          ) {
            return {
              np: a.np + Math.ceil(v.amount * 0.028),
              lp: a.lp,
              jp: a.jp,
            };
          }

          if (v.paymentMethod === "line-pay") {
            return {
              np: a.np,
              lp: a.lp + Math.ceil(v.amount * 0.0315),
              jp: a.jp,
            };
          }

          return a;
        },
        {
          np: 0,
          lp: 0,
          jp: 0,
        },
      );

      return {
        newebPay: acc.newebPay + monthlyFee.np,
        linePay: acc.linePay + monthlyFee.lp,
        JKOPAY: acc.JKOPAY + monthlyFee.jp,
      };
    },
    {
      newebPay: 0,
      linePay: 0,
      JKOPAY: 0,
    },
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
    fee: {
      newebPay: {
        year: new Date().getFullYear() + "藍新手續費",
        month: new Date().getMonth() + 1 + "月藍新手續費",
        day: new Date().getDate() + "日藍新手續費",
        custom: `指定範圍藍新手續費`,
      },
      linePay: {
        year: new Date().getFullYear() + "LinePay手續費",
        month: new Date().getMonth() + 1 + "月LinePay手續費",
        day: new Date().getDate() + "日LinePay手續費",
        custom: `指定範圍LinePay手續費`,
      },
      JKOPAY: {
        year: new Date().getFullYear() + "JKOPAY手續費",
        month: new Date().getMonth() + 1 + "月JKOPAY手續費",
        day: new Date().getDate() + "日JKOPAY手續費",
        custom: `指定範圍JKOPAY手續費`,
      },
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

  const feeTitle = (pt: "newebPay" | "linePay" | "JKOPAY") => {
    if (isYearData) return obj["fee"][pt]["year"];
    if (isMonthData) return obj["fee"][pt]["month"];
    if (isDayData) return obj["fee"][pt]["day"];
    return obj["fee"][pt]["custom"];
  };

  return (
    <div className="flex w-max justify-between">
      <div className="grid grid-cols-4 gap-2.5">
        <GraphRevenueCell
          title={activeDataType === "revenue" ? "總營業額" : "總訂單數"}
          amount={
            activeDataType === "revenue" ? totalRevenue : totalAppointmentCount
          }
        />
        {activeDataType === "revenue" && (
          <GraphRevenueCell title="藍新手續費" amount={totalFee.newebPay} />
        )}
        {activeDataType === "revenue" && (
          <GraphRevenueCell title="LinePay手續費" amount={totalFee.linePay} />
        )}
        {activeDataType === "revenue" && (
          <GraphRevenueCell title="JKOPAY手續費" amount={totalFee.JKOPAY} />
        )}
        {activeDataType === "revenue" && (
          <GraphRevenueCell
            title="實際營業額"
            amount={Math.round(
              totalRevenue -
                totalFee.newebPay -
                totalFee.linePay -
                totalFee.JKOPAY,
            )}
          />
        )}

        <div className="col-span-3" />

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
        {activeDataType === "revenue" && (
          <>
            <GraphRevenueCell
              title={feeTitle("newebPay")}
              amount={isYearData ? yearlyFee.newebPay : rangeFee.newebPay}
            />
            <GraphRevenueCell
              title={feeTitle("linePay")}
              amount={isYearData ? yearlyFee.linePay : rangeFee.linePay}
            />
            <GraphRevenueCell
              title={feeTitle("JKOPAY")}
              amount={isYearData ? yearlyFee.JKOPAY : rangeFee.JKOPAY}
            />
            <GraphRevenueCell
              title={isYearData ? "年度實際營業額" : "範圍實際營業額"}
              amount={
                isYearData
                  ? yearTotalRevenue -
                    yearlyFee.newebPay -
                    yearlyFee.linePay -
                    yearlyFee.JKOPAY
                  : rangeTotalRevenue -
                    rangeFee.newebPay -
                    rangeFee.linePay -
                    rangeFee.JKOPAY
              }
            />
          </>
        )}
      </div>

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
