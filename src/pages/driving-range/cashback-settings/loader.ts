import { z } from "zod";
import { queryClient } from "@/utils/query-client.ts";
import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader.ts";
import { getAllowedStores } from "@/utils";

export const chargeDiscountSchema = z.object({
  id: z.string(),
  title: z.string(),
  chargeAmount: z.number(),
  extraAmount: z.number(),
});

export const chargeDiscountsSchema = z.array(chargeDiscountSchema);

export type ChargeDiscount = z.infer<typeof chargeDiscountSchema>;

export async function loader() {
  return await queryClient.ensureQueryData(
    getStoresQuery(
      await getAllowedStores("ground"),
      "ground",
      JSON.parse(localStorage.getItem("golf-erp-user")!).account,
    ),
  );
}
