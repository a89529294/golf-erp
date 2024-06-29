import {
  simulatorStoresWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { getAllowedStores } from "@/utils";
import { simulatorSitesSchema } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { SimpleStore } from "@/utils/types";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const sitesSchema = z.object({
  data: simulatorSitesSchema.pick({ data: true }).shape.data,
});

export const genIndoorSimulatorStoresWithSitesQuery = (
  allowedStores: { id: string; name: string }[] | "all",
) => ({
  queryKey: ["sites-for-store", "simulator"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=99&filter[category]=simulator&populate=simulators&populate=grounds&populate=golfs&populate=simulators.openTimes&populate=simulators.equipment&populate=simulators.openDays",
      );
      const data = await response.json();

      return simulatorStoresWithSitesSchema.parse(data).data;
    } else {
      if (!allowedStores[0]) return [];

      const response = await privateFetch(
        `/store/${allowedStores[0].id}/simulator?pageSize=99&populate=*`,
      );

      const data = await response.json();

      const parsed = sitesSchema.parse(data);

      return [
        {
          ...(parsed.data[0]?.store ?? {
            id: allowedStores[0].id,
            name: allowedStores[0].name,
          }),
          sites: parsed.data,
        },
      ];
    }
  },
});

export const indoorSimulatorStoresQuery = (
  allowedStores: SimpleStore[] | "all",
) => ({
  queryKey: ["indoor-simulator-stores"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=99&filter[category]=simulator",
      );
      const data = await response.json();

      return storesWithoutEmployeesSchema.parse(data).data;
    } else return allowedStores;
  },
});

export async function loader() {
  return await queryClient.fetchQuery(
    genIndoorSimulatorStoresWithSitesQuery(await getAllowedStores("simulator")),
  );
}
