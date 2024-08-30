import { z } from "zod";
import { queryClient } from "@/utils/query-client.ts";
import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader.ts";
import { getAllowedStores } from "@/utils";

export const pointSettingSchema = z.object({
  amoutToPointNeed: z.number(),
});

export async function loader() {
  return await queryClient.ensureQueryData(
    getStoresQuery(
      await getAllowedStores("ground"),
      "ground",
      JSON.parse(localStorage.getItem("golf-erp-user")!).account,
    ),
  );
}
