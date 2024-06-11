import { membersQuery } from "@/pages/member-management/loader";
import { storesWithoutEmployeesSchema } from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const storesWithoutEmployeesQuery = {
  queryKey: ["stores-without-employees"],
  queryFn: async () => {
    const response = await privateFetch("/store?pageSize=999");
    const data = await response.json();

    return storesWithoutEmployeesSchema.parse(data);
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
