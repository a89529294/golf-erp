import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";

export async function loader() {
  return await queryClient.ensureQueryData(
    getStoresQuery(
      await getAllowedStores("ground"),
      "ground",
      JSON.parse(localStorage.getItem("golf-erp-user")!).account,
    ),
  );
}
