import { queryClient } from "@/utils/query-client";
import { golfStoresQuery } from "../loader";

export async function loader() {
  return queryClient.ensureQueryData(golfStoresQuery);
}
