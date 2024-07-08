import { usePrevIntervalReportDataQuery } from "@/api/use-prev-interval-report-data-query";
import GraphNumberCell from "@/pages/indoor-simulator/report/components/graph-number-cell";
import { DetailedData, YearData } from "@/pages/indoor-simulator/report/loader";
import { reportTimeRange } from "@/types-and-schemas/report";
import { fromRangeStringToLastDateSetBy } from "@/utils";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const nf = new Intl.NumberFormat("en-us");

export const RightPanel = React.forwardRef<
  HTMLDivElement,
  {
    data: {
      year: YearData;
      detailed: DetailedData;
    };
  }
>(function ({ data }, ref) {
  const { storeId } = useParams();
  const { data: prevData } = usePrevIntervalReportDataQuery({
    storeId: storeId ?? "",
  });
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range")! as reportTimeRange;
  const isYear = fromRangeStringToLastDateSetBy(range) === "year";
  const isMonth = fromRangeStringToLastDateSetBy(range) === "month";
  const isDay = fromRangeStringToLastDateSetBy(range) === "day";

  const firstCellTitle = isYear || isMonth || isDay ? "2024 營收" : "";
  const firstCellSubTitle = isYear
    ? "整年 年增率"
    : isMonth
      ? `${new Date().getMonth() + 1}月 年增率`
      : "";
  const secondCellSubTitle = isYear
    ? (new Date().getFullYear() - 1).toString() + "年"
    : "";
  const firstCellAmount = isYear
    ? Object.values(data.year).reduce((acc, val) => acc + val.totalAmount, 0)
    : 0;

  const secondCellAmount = isYear
    ? Object.values(prevData ?? 0).reduce((acc, v) => acc + v.totalAmount, 0)
    : 0;

  const amountDiff = firstCellAmount - secondCellAmount;

  return (
    <div ref={ref} className="w-[267px] rounded-md bg-white p-4">
      <GraphNumberCell
        title={firstCellTitle}
        subTitle={
          <>
            {firstCellSubTitle}
            <span className="flex items-center text-line-green">
              +10%
              <div className="ml-1 size-0 border-x-[3.75px] border-b-[8.66px] border-x-transparent border-b-line-green" />
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
      {amountDiff > 0 ? (
        <div className="mt-4 rounded-md bg-line-green/10 py-5 text-center text-3xl text-line-green">
          +{nf.format(amountDiff)}
        </div>
      ) : (
        <div className="mt-4 rounded-md bg-word-red/10 py-5 text-center text-3xl text-word-red">
          {firstCellAmount - secondCellAmount >= 0 ? "+" : "-"}
          {nf.format(amountDiff)}
        </div>
      )}
    </div>
  );
});
