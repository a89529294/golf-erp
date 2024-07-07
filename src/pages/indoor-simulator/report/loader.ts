import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import queryString from "query-string";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

const monthSchema = z.object({
  totalAmount: z.number(),
  totalCount: z.number(),
  appointments: z.array(z.any()),
});

const yearSchema = z.object({
  1: monthSchema,
  2: monthSchema,
  3: monthSchema,
  4: monthSchema,
  5: monthSchema,
  6: monthSchema,
  7: monthSchema,
  8: monthSchema,
  9: monthSchema,
  10: monthSchema,
  11: monthSchema,
  12: monthSchema,
});

const dataSchema = z.array(yearSchema);

const genDataQuery = (storeId: string, year: number, siteIds: string[]) => ({
  queryKey: ["simulator", storeId, "report-data"],
  queryFn: async () => {
    const qs = queryString.stringify({
      year,
      storeId,
    });
    const promises = [
      privateFetch(`/appointment/simulator/report?${qs}`).then((r) => r.json()),
      ...siteIds.map((siteId) => {
        const qs = queryString.stringify({
          year,
          storeId,
          storeSimulatorId: siteId,
        });

        return privateFetch(`/appointment/simulator/report?${qs}`).then((r) =>
          r.json(),
        );
      }),
    ];

    const data = await Promise.all(promises);

    const parsedData = dataSchema.parse(data);

    return {
      store: {
        [storeId]: parsedData[0],
      },
      sites: siteIds.map((siteId, idx) => ({
        [siteId]: parsedData.slice(1)[idx],
      })),
    };
  },
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const range = url.searchParams.get("range");

  console.log(params);
  console.log(query, range);

  const simulators = await queryClient.fetchQuery(
    genIndoorSimulatorStoresWithSitesQuery(await getAllowedStores("simulator")),
  );

  if (!params.storeId)
    return {
      simulators,
    };

  const data = await queryClient.fetchQuery(
    genDataQuery(
      params.storeId,
      2024,
      simulators.find((s) => s.id === params.storeId)?.sites.map((v) => v.id) ??
        [],
    ),
  );

  console.log(simulators);
  console.log(data);

  return {
    simulators,
    data,
  };
}
