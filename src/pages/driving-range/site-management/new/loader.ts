import { queryClient } from "@/utils/query-client";
import { groundStoresQuery } from "../loader";
import { getAllowedStores } from "@/utils";

export async function loader() {
  return await queryClient.ensureQueryData(
    groundStoresQuery(await getAllowedStores("ground")),
  );
}
