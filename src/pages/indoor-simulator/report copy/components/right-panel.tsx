import { usePrevIntervalReportDataQuery } from "@/api/use-prev-interval-report-data-query";
import { cn } from "@/lib/utils";
import GraphNumberCell from "@/pages/indoor-simulator/report/components/graph-number-cell";
import { ReportData } from "@/pages/indoor-simulator/report/loader";
import { reportTimeRange } from "@/types-and-schemas/report";
import { fromRangeStringToLastDateSetBy } from "@/utils";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const nf = new Intl.NumberFormat("en-us");

export const RightPanel = React.forwardRef<
  HTMLDivElement,
  {
    data: ReportData;
  }
>(function ({ data }, ref) {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range")! as reportTimeRange;
  const { data: prevData } = usePrevIntervalReportDataQuery({
    storeId: storeId ?? "",
    range,
  });

  const isYear = fromRangeStringToLastDateSetBy(range) === "year";
  const isMonth = fromRangeStringToLastDateSetBy(range) === "month";
  const isDay = fromRangeStringToLastDateSetBy(range) === "day";

  const firstCellTitle =
    isYear || isMonth || isDay ? "2024 營收" : "指定範圍 營收";
  const firstCellSubTitle = isYear
    ? "整年 年增率"
    : isMonth
      ? `${new Date().getMonth() + 1}月 年增率`
      : isDay
        ? `${new Date().getMonth() + 1}月${new Date().getDate()}日`
        : "指定範圍 年增率";
  const secondCellSubTitle = isYear
    ? (new Date().getFullYear() - 1).toString() + "年"
    : "";
  const firstCellAmount = isYear
    ? Object.values(data.year).reduce(
        (acc, val) => acc + (val.totalAmount ?? 0),
        0,
      )
    : Object.values(data.detailed).reduce(
        (acc, val) => acc + (val.totalAmount ?? 0),
        0,
      );

  const secondCellAmount = Object.values(prevData ?? {}).reduce(
    (acc, v) => acc + v.totalAmount,
    0,
  );

  const amountDiff = firstCellAmount - secondCellAmount;
  const amountDiffPercent = (() => {
    if (firstCellAmount === 0) return "+0%";
    if (secondCellAmount === 0) return "+∞%";
    return (
      (amountDiff > 0 ? "+" : "") +
      Math.round((amountDiff / secondCellAmount) * 10000) / 100 +
      "%"
    );
  })();

  return (
    <div ref={ref} className="w-[267px] rounded-md bg-white p-4">
      <GraphNumberCell
        title={firstCellTitle}
        subTitle={
          <>
            {firstCellSubTitle}
            <span
              className={cn(
                "flex items-center text-line-green",
                amountDiff < 0 && "text-word-red",
              )}
            >
              {amountDiffPercent}
              <div
                className={cn(
                  "ml-1 size-0 border-x-[3.75px] border-x-transparent ",
                  amountDiff < 0
                    ? "border-t-[8.66px] border-t-word-red"
                    : "border-b-[8.66px] border-b-line-green",
                )}
              />
            </span>
          </>
        }
        number={firstCellAmount}
      />
      <div className="border-b border-line-gray" />
      <GraphNumberCell
        title="去年 同期營收"
        subTitle={<>{secondCellSubTitle}</>}
        number={secondCellAmount}
        secondary
      />
      {amountDiff >= 0 ? (
        <div className="mt-4 rounded-md bg-line-green/10 py-5 text-center text-3xl text-line-green">
          +{nf.format(amountDiff)}
        </div>
      ) : (
        <div className="mt-4 rounded-md bg-word-red/10 py-5 text-center text-3xl text-word-red">
          {nf.format(amountDiff)}
        </div>
      )}
    </div>
  );
});
