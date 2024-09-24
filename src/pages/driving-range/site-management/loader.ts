import {
  groundStoresWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { getAllowedStores } from "@/utils";
import { groundSitesSchema } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { SimpleStore } from "@/utils/types";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const sitesSchema = z.object({
  data: groundSitesSchema.pick({ data: true }).shape.data,
});

export const genGroundStoresWithSitesQuery = (
  allowedStores: SimpleStore[] | "all",
) => {
  return {
    queryKey: ["sites-for-store", "ground"],
    queryFn: async () => {
      if (allowedStores === "all") {
        const response = await privateFetch(
          "/store?pageSize=999&filter[category]=ground&populate=simulators&populate=grounds&populate=golfs&populate=grounds.openTimes&populate=grounds.equipments&populate=grounds.openDays&populate=merchantId",
        );

        const x = await response.json();

        const data = groundStoresWithSitesSchema.parse(x).data;

        return data;
      } else {
        if (!allowedStores[0]) return [];

        const promises = allowedStores.map((as) =>
          privateFetch(`/store/${as.id}/ground?pageSize=999&populate=*`),
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
  };
};

export const groundStoresQuery = (allowedStores: SimpleStore[] | "all") => ({
  queryKey: ["ground-stores"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=ground",
      );

      const data = storesWithoutEmployeesSchema.parse(
        await response.json(),
      ).data;

      return data;
    } else return allowedStores;
  },
});

export async function loader() {
  return await queryClient.fetchQuery(
    genGroundStoresWithSitesQuery(await getAllowedStores("ground")),
  );
}
