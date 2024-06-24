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
  allowedStores: { id: string; name: string }[] | "all",
) => {
  return {
    queryKey: ["sites-for-stores", "ground"],
    queryFn: async () => {
      if (allowedStores === "all") {
        const response = await privateFetch(
          "/store?pageSize=99&filter[category]=ground&populate=simulators&populate=grounds&populate=golfs&populate=grounds.openTimes&populate=grounds.equipment&populate=grounds.openDays",
        );

        const x = await response.json();

        const data = groundStoresWithSitesSchema.parse(x).data;

        return data;
      } else {
        const response = await privateFetch(
          `/store/${allowedStores[0].id}/ground?pageSize=99&populate=*`,
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
  };
};

export const groundStoresQuery = (allowedStores: SimpleStore[] | "all") => ({
  queryKey: ["ground-stores"],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        "/store?pageSize=99&filter[category]=ground",
      );

      const data = storesWithoutEmployeesSchema.parse(
        await response.json(),
      ).data;

      return data;
    } else return allowedStores;
  },
});

export async function loader() {
  return await queryClient.ensureQueryData(
    genGroundStoresWithSitesQuery(await getAllowedStores("ground")),
  );
}
