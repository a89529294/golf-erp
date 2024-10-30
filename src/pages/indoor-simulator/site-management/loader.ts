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
      if (!allowedStores[0]) return [];

      const promises = allowedStores.map((as) =>
        privateFetch(`/store/${as.id}/simulator?pageSize=999&populate=openTimes&populate=equipments&populate=openDays&populate=store`),
      );

      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map((r) => r.json()));
      const parsedData = data.map((d) => sitesSchema.parse(d));

      return parsedData.map((pd, i) => ({
        id: allowedStores[i].id,
        name: allowedStores[i].name,
        merchantId: allowedStores[i].merchantId,
        sites: pd.data,
      }));
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
        "/store?pageSize=999&filter[category]=simulator",
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
