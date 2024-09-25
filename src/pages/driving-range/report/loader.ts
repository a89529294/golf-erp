import { groundStoresWithSitesSchema } from "@/pages/store-management/loader";
import { baseAppointmentSchema } from "@/types-and-schemas/appointment";
import { formatDateAsString, getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { addDays, differenceInDays, subDays } from "date-fns";
import queryString from "query-string";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

const totalSchema = z.object({
  totalAmount: z
    .number()
    .nullable()
    .transform((v) => v ?? 0),
  totalCount: z.number(),
  storeGroundAppointments: z.record(
    z.string(),
    z.object({
      totalAmount: z.number(),
      totalCount: z.number(),
      storeGround: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
  ),
});

const objectSchema = z.object({
  totalAmount: z
    .number()
    .nullable()
    .transform((v) => v ?? 0),
  totalCount: z.number(),
  storeGroundAppointments: z
    .record(z.string(), z.array(baseAppointmentSchema))
    .optional()
    .transform((v) => v ?? {}),
});

export type ReportItem = z.infer<typeof objectSchema>;

export const yearSchema = z.object({
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
  all: z.object({
    totalAmount: z
      .number()
      .nullable()
      .transform((v) => v ?? 0),
    totalCount: z.number(),
  }),
});
export type YearData = Omit<z.infer<typeof yearSchema>, "all">;

export const detailedSchema = z.record(z.string(), objectSchema);
export type DetailedData = Omit<z.infer<typeof detailedSchema>, "all">;

export const genGroundStoresQuery = (
  allowedStores: { id: string; name: string; merchantId: string }[] | "all",
) => ({
  queryKey: ["sites-for-store", "simulator"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=ground&populate=simulators&populate=grounds&populate=golfs&populate=grounds.openTimes&populate=grounds.equipments&populate=grounds.openDays&populate=merchantId",
      );
      const data = await response.json();

      return groundStoresWithSitesSchema.parse(data).data;
    } else {
      return allowedStores;
    }
  },
});

export const genDataQuery = (storeId: string, startAt: Date, endAt: Date) => ({
  queryKey: ["ground", storeId, "report-data", startAt, endAt],
  queryFn: async () => {
    const qsYear = queryString.stringify({
      year: new Date().getFullYear(),
      storeId,
    });

    const updateStartAndEnd = differenceInDays(startAt, endAt) === 0;

    const qs = queryString.stringify({
      startAt: formatDateAsString(
        updateStartAndEnd ? subDays(startAt, 1) : startAt,
      ),
      endAt: formatDateAsString(updateStartAndEnd ? addDays(endAt, 1) : endAt),
      storeId,
    });

    const promises = [
      privateFetch(`/appointment/ground/report/count?storeId=${storeId}`).then(
        (r) => r.json(),
      ),
      privateFetch(`/appointment/ground/report?${qsYear}`).then((r) =>
        r.json(),
      ),
      privateFetch(`/appointment/ground/daily-report?${qs}`).then((r) =>
        r.json(),
      ),
    ];

    const data = await Promise.all(promises);
    const totalData = totalSchema.parse(data[0]);
    const yearData = yearSchema.parse(data[1]);
    const detailedData = detailedSchema.parse(data[2]);

    return {
      total: totalData,
      year: {
        1: yearData["1"],
        2: yearData["2"],
        3: yearData["3"],
        4: yearData["4"],
        5: yearData["5"],
        6: yearData["6"],
        7: yearData["7"],
        8: yearData["8"],
        9: yearData["9"],
        10: yearData["10"],
        11: yearData["11"],
        12: yearData["12"],
      },
      detailed: Object.entries(detailedData).reduce((acc, value) => {
        if (value[0] !== "all") acc[value[0]] = value[1];
        return acc;
      }, {} as DetailedData),
    };
  },
});

export type ReportData = Awaited<
  ReturnType<ReturnType<typeof genDataQuery>["queryFn"]>
>;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const range = url.searchParams.get("range")!;

  const ground = await queryClient.ensureQueryData(
    genGroundStoresQuery(await getAllowedStores("ground")),
  );

  if (!params.storeId)
    return {
      ground,
    };

  const data = await queryClient.fetchQuery(
    genDataQuery(
      params.storeId,
      new Date(range.split(":")[0]),
      new Date(range.split(":")[1]),
    ),
  );

  return {
    ground,
    data,
  };
}
