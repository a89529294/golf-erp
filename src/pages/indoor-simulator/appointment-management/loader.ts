import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { queryClient } from "@/utils/query-client";

export async function loader() {
  const stores = (
    await queryClient.ensureQueryData(indoorSimulatorStoresQuery)
  ).map((v) => ({ id: v.id, name: v.name }));

  return stores;
}
