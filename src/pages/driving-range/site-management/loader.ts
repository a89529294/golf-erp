import { storesWithoutEmployeesSchema } from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const groundStoresQuery = {
  queryKey: ["ground-stores-no-employees"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=ground",
    );

    const data = storesWithoutEmployeesSchema.parse(await response.json()).data;

    return data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(groundStoresQuery);
}
