import { formatDateAsString, getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { addDays, differenceInDays, format, subDays } from "date-fns";
import queryString from "query-string";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

import { simulatorStoresWithSitesSchema } from "@/pages/store-management/loader";
import { simulatorSitesSchema } from "@/utils/category/schemas";

export const sitesSchema = z.object({
  data: simulatorSitesSchema.pick({ data: true }).shape.data,
});

export const genIndoorSimulatorStoresQuery = (
  allowedStores: { id: string; name: string; merchantId: string }[] | "all",
) => ({
  queryKey: ["sites-for-store", "simulator"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=simulator&populate=simulators&populate=grounds&populate=golfs&populate=simulators.openTimes&populate=simulators.equipments&populate=simulators.openDays&populate=store",
      );
      const data = await response.json();

      return simulatorStoresWithSitesSchema.parse(data).data;
    } else {
      return allowedStores;
    }
  },
});

const orderSchema = z.object({
  id: z.string(),
  userName: z.string(),
  userPhone: z.string(),
  merchantId: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  createdAt: z.coerce.date().transform((v) => format(v, "y-MM-dd H:mm:ss")),
  paymentMethod: z
    .string()
    .nullable()
    .transform((v) => v ?? ""),
  amount: z.number(),
  simulatorAppointment: z
    .object({
      id: z.string(),
      status: z.string(),
      storeSimulator: z.object({
        id: z.string(),
        name: z.string(),
      }),
      startTime: z.coerce.date().transform((v) => format(v, "y-MM-dd H:mm:ss")),
      endTime: z.coerce.date().transform((v) => format(v, "y-MM-dd H:mm:ss")),
      appUser: z
        .object({
          id: z.string(),
          chName: z.string(),
          phone: z
            .string()
            .nullish()
            .transform((v) => v ?? ""),
        })
        .nullable(),
      amount: z.number(),
    })
    .nullable(),
  appChargeHistory: z
    .object({
      id: z.string(),
      createdAt: z.coerce.date().transform((v) => format(v, "y-MM-dd H:mm:ss")),
    })
    .nullable(),
});

const totalSchema = z.object({
  totalAmount: z
    .number()
    .nullable()
    .transform((v) => v ?? 0),
  totalCount: z.number(),
  orders: z.array(orderSchema),
});

const objectSchema = z.object({
  totalAmount: z
    .number()
    .nullable()
    .transform((v) => v ?? 0),
  totalCount: z.number(),
  orders: z
    .array(orderSchema)
    .nullish()
    .transform((v) => v ?? []),
});

export type ReportItem = z.infer<typeof objectSchema>;

export type Order = z.infer<typeof orderSchema>;

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

export const genDataQuery = (storeId: string, startAt: Date, endAt: Date) => ({
  queryKey: ["simulator", storeId, "report-data", startAt, endAt],
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
      populate: "*",
    });

    const promises = [
      privateFetch(
        `/appointment/simulator/order-report/count?storeId=${storeId}`,
      ).then((r) => r.json()),
      privateFetch(`/appointment/simulator/order-report?${qsYear}`).then((r) =>
        r.json(),
      ),
      privateFetch(`/appointment/simulator/daily-order-report?${qs}`).then(
        (r) => r.json(),
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

  const simulators = await queryClient.ensureQueryData(
    genIndoorSimulatorStoresQuery(await getAllowedStores("simulator")),
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
