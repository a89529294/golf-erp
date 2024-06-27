import { groundRepairRequestsSchema } from "@/types-and-schemas/repair-request";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import qs from "query-string";

export const groundRepairRequestsQuery = {
  queryKey: ["ground-repair-requests"],
  queryFn: async () => {
    const queryString = qs.stringify({
      pageSize: 99,
      sort: "createdAt",
      order: "DESC",
      populate: "storeGround.store",
      "filter[storeGround][$notNull]": "",
    });
    const response = await privateFetch(`/repair-request?${queryString}`);
    const data = await response.json();

    const parsed = groundRepairRequestsSchema.parse(data).data;

    return parsed;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(groundRepairRequestsQuery);
}
