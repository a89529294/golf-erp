import {
  storesWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const golfStoresWithSitesQuery = {
  queryKey: ["golf-stores-with-sites"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=golf&populate=simulators&populate=grounds&populate=golfs&populate=golfs.openTimes&populate=golfs.equipment&populate=golfs.openDays",
    );

    const data = await response.json();

    console.log(storesWithSitesSchema.safeParse(data));

    return storesWithSitesSchema.parse(data).data;
  },
};

export const golfStoresQuery = {
  queryKey: ["golf-stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=golf",
    );

    const data = await response.json();

    return storesWithoutEmployeesSchema.parse(data).data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(golfStoresWithSitesQuery);
}
