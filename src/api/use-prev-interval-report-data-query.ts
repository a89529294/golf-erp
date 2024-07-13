import {
  ReportItem,
  detailedSchema,
  yearSchema,
} from "@/pages/indoor-simulator/report/loader";
import { reportTimeRange } from "@/types-and-schemas/report";
import { privateFetch } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { endOfYear, format, isSameDay, startOfYear, subYears } from "date-fns";
import queryString from "query-string";

export function usePrevIntervalReportDataQuery({
  storeId,
  range,
}: {
  storeId: string;
  range: reportTimeRange;
}) {
  return useQuery({
    queryKey: [
      "store",
      storeId,
      "report-data",
      range.split(":")[0],
      range.split(":")[1],
    ],
    queryFn: async () => {
      const startAt = range.split(":")[0];
      const endAt = range.split(":")[1];

      const isFullCurrentYear =
        isSameDay(startOfYear(new Date()), new Date(startAt)) &&
        isSameDay(endOfYear(new Date()), new Date(endAt));

      if (isFullCurrentYear) {
        const response = await privateFetch(
          `/appointment/simulator/report?storeId=${storeId}&year=${new Date().getFullYear() - 1}`,
        );
        const data = await response.json();

        const parsedData = yearSchema.parse(data);

        return parsedData;
      } else {
        const qs = queryString.stringify({
          storeId,
          startAt: format(subYears(new Date(startAt), 1), "yyyy-MM-dd"),
          endAt: format(subYears(new Date(endAt), 1), "yyyy-MM-dd"),
        });

        const response = await privateFetch(
          `/appointment/simulator/daily-report?${qs}`,
        );
        const data = await response.json();

        const parsedData = detailedSchema.parse(data);

        return Object.entries(parsedData).reduce(
          (acc, [key, value]) => {
            if (key !== "all") acc[key] = value;
            return acc;
          },
          {} as Record<string, ReportItem>,
        );
      }
    },
  });
}
