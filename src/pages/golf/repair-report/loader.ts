import { golfRepairRequestsSchema } from "@/types-and-schemas/repair-request";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import qs from "query-string";

export const golfRepairRequestsQuery = {
  queryKey: ["golf-repair-requests"],
  queryFn: async () => {
    const queryString = qs.stringify({
      pageSize: 99,
      sort: "createdAt",
      order: "DESC",
      populate: "storeGolf.store",
      "filter[storeGolf][$notNull]": "",
    });
    const response = await privateFetch(`/repair-request?${queryString}`);
    const data = await response.json();

    const parsed = golfRepairRequestsSchema.parse(data).data;

    return parsed;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(golfRepairRequestsQuery);
}
