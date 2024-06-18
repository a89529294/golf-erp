import {
  storesWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const indoorSimulatorStoresWithSitesQuery = {
  queryKey: ["indoor-simulator-stores-with-sites"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=simulator&populate=simulators&populate=grounds&populate=golfs&populate=simulators.openTimes&populate=simulators.equipment&populate=simulators.openDays",
    );
    const data = await response.json();

    return storesWithSitesSchema.parse(data).data;
  },
};

export const indoorSimulatorStoresQuery = {
  queryKey: ["indoor-simulator-stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=simulator",
    );
    const data = await response.json();

    return storesWithoutEmployeesSchema.parse(data).data;
  },
};

export async function loader() {
  return queryClient.ensureQueryData(indoorSimulatorStoresWithSitesQuery);
}
