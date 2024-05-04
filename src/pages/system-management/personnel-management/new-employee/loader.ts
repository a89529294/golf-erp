import { storeQuery } from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";

export async function loader() {
  return await queryClient.ensureQueryData(storeQuery);
}
