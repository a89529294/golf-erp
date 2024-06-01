import { queryClient } from "@/utils/query-client";
import { indoorSimulatorStoresQuery } from "../loader";

export async function loader() {
  return queryClient.ensureQueryData(indoorSimulatorStoresQuery);
}
