import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import { formatDateAsString, getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import queryString from "query-string";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

const objectSchema = z.object({
  totalAmount: z.number(),
  totalCount: z.number(),
  storeSimulatorAppointments: z.record(
    z.string(),
    z.array(
      z.object({
        id: z.string(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        amount: z.number(),
        appUser: z.object({
          id: z.string(),
          chName: z.string(),
          phone: z.string(),
        }),
      }),
    ),
  ),
});

const yearSchema = z.object({
  1: objectSchema,
  2: objectSchema,
  3: objectSchema,
  4: objectSchema,
  5: objectSchema,
  6: objectSchema,
  7: objectSchema,
  8: objectSchema,
  9: objectSchema,
  10: objectSchema,
  11: objectSchema,
  12: objectSchema,
});
export type YearData = z.infer<typeof yearSchema>;

const detailedSchema = z.record(z.string(), objectSchema);
export type DetailedData = z.infer<typeof detailedSchema>;

// const dataSchema = z.array(yearSchema);

export const genDataQuery = (storeId: string, startAt: Date, endAt: Date) => ({
  queryKey: ["simulator", storeId, "report-data", startAt, endAt],
  queryFn: async () => {
    const qsYear = queryString.stringify({
      year: new Date().getFullYear(),
      storeId,
    });

    const qs = queryString.stringify({
      startAt: formatDateAsString(startAt),
      endAt: formatDateAsString(endAt),
      storeId,
    });

    const promises = [
      privateFetch(`/appointment/simulator/report?${qsYear}`).then((r) =>
        r.json(),
      ),
      privateFetch(`/appointment/simulator/daily-report?${qs}`).then((r) =>
        r.json(),
      ),
    ];

    const data = await Promise.all(promises);
    const yearData = yearSchema.parse(data[0]);
    const detailedData = detailedSchema.parse(data[1]);

    return {
      year: yearData,
      detailed: detailedData,
    };
  },
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  // export async function loader() {
  const url = new URL(request.url);
  const range = url.searchParams.get("range")!;

  const simulators = await queryClient.ensureQueryData(
    genIndoorSimulatorStoresWithSitesQuery(await getAllowedStores("simulator")),
  );

  if (!params.storeId)
    return {
      simulators,
    };

  const data = await queryClient.fetchQuery(
    genDataQuery(
      params.storeId,
      new Date(range.split(":")[0]),
      new Date(range.split(":")[1]),
    ),
  );

  return {
    simulators,
    data,
  };
}
