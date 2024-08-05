import { membersQuery } from "@/pages/member-management/loader";
import { storesWithoutEmployeesSchema } from "@/pages/store-management/loader";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const storesWithoutEmployeesQuery = {
  queryKey: ["stores-without-employees"],
  queryFn: async () => {
    const stores = await getAllowedStores("golf");
    if (stores === "all") {
      const response = await privateFetch(
        "/store?pageSize=999&filter[category]=golf",
      );
      const data = await response.json();

      return storesWithoutEmployeesSchema.parse(data).data;
    }
    return stores;
  },
};

export async function loader() {
  const data = await Promise.all([
    queryClient.ensureQueryData(storesWithoutEmployeesQuery),
    queryClient.ensureQueryData(membersQuery),
  ]);
  return {
    stores: data[0],
    appUsers: data[1],
  };
}
