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
        "/store?pageSize=99&filter[category]=golf&populate=simulators&populate=grounds&populate=golfs&populate=golfs.openTimes&populate=golfs.equipment&populate=golfs.openDays",
      );

      const data = await response.json();

      return golfStoresWithSitesSchema.parse(data).data;
    } else {
      const response = await privateFetch(
        `/store/${allowedStores[0].id}/golf?pageSize=99&populate=*`,
      );

      const data = sitesSchema.parse(await response.json());

      return [
        {
          ...(data.data[0]?.store ?? {
            id: allowedStores[0].id,
            name: allowedStores[0].name,
          }),
          sites: data.data,
        },
      ];
    }
  },
});

export const golfStoresQuery = (allowedStores: SimpleStore[] | "all") => ({
  queryKey: ["golf-stores"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=99&filter[category]=golf",
      );

      const data = await response.json();

      return storesWithoutEmployeesSchema.parse(data).data;
    } else return allowedStores;
  },
});

export async function loader() {
  return await queryClient.ensureQueryData(
    genGolfStoresWithSitesQuery(await getAllowedStores("golf")),
  );
}
