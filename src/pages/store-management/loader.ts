import {
  golfSitesSchema,
  groundSitesSchema,
  simulatorSitesSchema,
  storeSchema,
} from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const storesSchema = z.object({
  data: z.array(storeSchema),
});

export const storesWithoutEmployeesSchema = z.object({
  data: z.array(storeSchema.omit({ employees: true })),
});

export const golfStoresWithSitesSchema = z.object({
  data: z.array(
    storeSchema
      .pick({ id: true, name: true })
      .extend({
        golfs: golfSitesSchema.pick({ data: true }).shape.data,
      })
      .transform((v) => {
        const { golfs, ...rest } = v;
        return { ...rest, sites: golfs };
      }),
  ),
});
export const groundStoresWithSitesSchema = z.object({
  data: z.array(
    storeSchema
      .pick({ id: true, name: true, merchantId: true })
      .extend({
        grounds: groundSitesSchema.pick({ data: true }).shape.data,
      })
      .transform((v) => {
        const { grounds, ...rest } = v;
        return {
          ...rest,
          sites: grounds,
        };
      }),
  ),
});
export const simulatorStoresWithSitesSchema = z.object({
  data: z.array(
    storeSchema
      .pick({ id: true, name: true, merchantId: true })
      .extend({
        simulators: simulatorSitesSchema.pick({ data: true }).shape.data,
      })
      .transform((v) => {
        const { simulators, ...rest } = v;
        return {
          ...rest,
          sites: simulators,
        };
      }),
  ),
});

export type GolfStoreWithSites = z.infer<
  typeof golfStoresWithSitesSchema
>["data"][number];
export type GroundStoreWithSites = z.infer<
  typeof groundStoresWithSitesSchema
>["data"][number];
export type SimulatorStoreWithSites = z.infer<
  typeof simulatorStoresWithSitesSchema
>["data"][number];

export type Store = z.infer<typeof storesSchema>["data"][number];
export type StoreWithoutEmployees = z.infer<
  typeof storesWithoutEmployeesSchema
>["data"][number];

export const storesQuery = {
  queryKey: ["stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&populate=employees",
    );

    const data = await response.json();

    const parsed = storesSchema.parse(data).data;

    const x = {
      golf: parsed.filter((s) => s.category === "golf"),
      ground: parsed.filter((s) => s.category === "ground"),
      simulator: parsed.filter((s) => s.category === "simulator"),
    };

    return x;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(storesQuery);
}
