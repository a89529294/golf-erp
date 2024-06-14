import {
  storesWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const groundStoresWithSitesQuery = {
  queryKey: ["ground-stores-with-sites"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=ground&populate=simulators&populate=grounds&populate=golfs&populate=grounds.openTimes&populate=grounds.equipment&populate=grounds.openDays",
    );

    const data = storesWithSitesSchema.parse(await response.json()).data;

    return data;
  },
};

export const groundStoresQuery = {
  queryKey: ["ground-stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=ground",
    );

    const data = storesWithoutEmployeesSchema.parse(await response.json()).data;

    return data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(groundStoresWithSitesQuery);
}
