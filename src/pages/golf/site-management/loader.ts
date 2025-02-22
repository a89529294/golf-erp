import {
  golfStoresWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { getAllowedStores } from "@/utils";
import { golfSitesSchema } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { SimpleStore } from "@/utils/types";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const sitesSchema = z.object({
  data: golfSitesSchema.pick({ data: true }).shape.data,
});

export const genGolfStoresWithSitesQuery = (
  allowedStores: { id: string; name: string }[] | "all",
) => ({
  queryKey: ["sites-for-store", "golf"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=golf&populate=simulators&populate=grounds&populate=golfs&populate=golfs.openTimes&populate=golfs.equipments&populate=golfs.openDays",
      );

      const data = await response.json();

      return golfStoresWithSitesSchema.parse(data).data;
    } else {
      if (!allowedStores[0]) return [];
      const promises = allowedStores.map((as) =>
        privateFetch(`/store/${as.id}/golf?pageSize=999&&populate=openTimes&populate=equipments&populate=openDays`),
      );

      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map((r) => r.json()));
      const parsedData = data.map((d) => sitesSchema.parse(d));

      return parsedData.map((pd, i) => ({
        id: allowedStores[i].id,
        name: allowedStores[i].name,
        sites: pd.data,
      }));
    }
  },
});

export const golfStoresQuery = (allowedStores: SimpleStore[] | "all") => ({
  queryKey: ["golf-stores"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=golf",
      );

      const data = await response.json();

      return storesWithoutEmployeesSchema.parse(data).data;
    } else return allowedStores;
  },
});

export async function loader() {
  return await queryClient.fetchQuery(
    genGolfStoresWithSitesQuery(await getAllowedStores("golf")),
  );
}
