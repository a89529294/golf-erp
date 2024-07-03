import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";

export async function loader() {
  return await queryClient.fetchQuery(
    genIndoorSimulatorStoresWithSitesQuery(await getAllowedStores("simulator")),
  );
}
