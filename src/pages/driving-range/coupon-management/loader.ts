import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader";
import { fromDateToDateString, getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { z } from "zod";

export const couponSchema = z.object({
  id: z.string(),
  number: z.string(),
  name: z.string(),
  amount: z.number(),
  startDate: z.coerce.date().transform(fromDateToDateString).optional(),
  endDate: z.coerce.date().transform(fromDateToDateString).optional(),
  expiration: z.number(),
  isActive: z.boolean(),
  isCustomerView: z.boolean(),
  store: z.object({
    id: z.string(),
  }),
});

export type Coupon = z.infer<typeof couponSchema>;

export const couponsSchema = z.object({
  data: z.array(couponSchema),
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
