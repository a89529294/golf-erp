import { queryClient } from "@/utils/query-client";
import { groundStoresQuery } from "../loader";

export async function loader() {
  return await queryClient.ensureQueryData(groundStoresQuery);
}
