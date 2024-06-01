import { storesWithoutEmployeesSchema } from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const indoorSimulatorStoresQuery = {
  queryKey: ["indoor-simulator-stores-no-employees"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=simulator",
    );
    return storesWithoutEmployeesSchema.parse(await response.json()).data;
  },
};

export async function loader() {
  return queryClient.ensureQueryData(indoorSimulatorStoresQuery);
}
