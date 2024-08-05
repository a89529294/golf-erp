import { queryClient } from "@/utils/query-client";
import { indoorSimulatorStoresQuery } from "../loader";
import { getAllowedStores } from "@/utils";

export async function loader() {
  return queryClient.ensureQueryData(
    indoorSimulatorStoresQuery(await getAllowedStores("simulator")),
  );
}
