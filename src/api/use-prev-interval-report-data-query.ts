import { yearSchema } from "@/pages/indoor-simulator/report/loader";
import { privateFetch } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

export function usePrevIntervalReportDataQuery({
  storeId,
}: {
  storeId: string;
}) {
  return useQuery({
    queryKey: ["store", storeId, "report-data", new Date().getFullYear()],
    queryFn: async () => {
      const response = await privateFetch(
        `/appointment/simulator/report?storeId=${storeId}&year=2023`,
      );
      const data = await response.json();

      const parsedData = yearSchema.parse(data);

      return parsedData;
    },
  });
}
