import { simulatorRepairRequestsSchema } from "@/types-and-schemas/repair-request";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import qs from "query-string";

export const simulatorRepairRequestsQuery = {
  queryKey: ["simulator-repair-requests"],
  queryFn: async () => {
    const queryString = qs.stringify({
      pageSize: 99,
      sort: "createdAt",
      order: "DESC",
      populate: "storeSimulator.store",
      "filter[storeSimulator][$notNull]": "",
    });
    const response = await privateFetch(`/repair-request?${queryString}`);
    const data = await response.json();

    const parsed = simulatorRepairRequestsSchema.parse(data).data;

    return parsed;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(simulatorRepairRequestsQuery);
}
