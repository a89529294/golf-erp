import { queryClient } from "@/utils/query-client";
import { golfStoresQuery } from "../loader";
import { getAllowedStores } from "@/utils";

export async function loader() {
  const r = await getAllowedStores("golf");
  return queryClient.ensureQueryData(golfStoresQuery(r));
}
