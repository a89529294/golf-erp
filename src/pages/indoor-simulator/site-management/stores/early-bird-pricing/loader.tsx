import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

export const earlyBirdPricingSchema = z.object({
  isUseSpecialPlan: z.boolean().optional().default(false),
  specialPlans: z
    .array(
      z.object({
        day: z.number().min(1).max(7), // 1 for Monday, 7 for Sunday or similar convention
        timeRanges: z
          .array(
            z.object({
              startTime: z
                .string()
                .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
                  // HH:mm:ss format
                  message: "開始時間格式不正確 (HH:mm:ss)",
                })
                .transform((v) => {
                  const arr = v.split(":");
                  return `${arr[0]}:${arr[1]}`;
                }),
              endTime: z
                .string()
                .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
                  message: "結束時間格式不正確 (HH:mm:ss)",
                })
                .transform((v) => {
                  const arr = v.split(":");
                  return `${arr[0]}:${arr[1]}`;
                }),
              discount: z
                .number()
                .min(0)
                .max(1, { message: "折扣必須介於0和1之間" }),
            }),
          )
          .optional(),
      }),
    )
    .default([]),
});

export const genEarlyBirdPricingForStoreQuery = (storeId: string) => ({
  queryKey: ["early-bird-pricing", "store", storeId],
  queryFn: async () => {
    const response = await privateFetch(`/store/${storeId}`);
    const data = await response.json();
    return earlyBirdPricingSchema.parse(data);
  },
});

export async function loader({
  params,
}: LoaderFunctionArgs<{ storeId: string }>) {
  const { storeId } = params;
  const p = await Promise.all([
    queryClient.fetchQuery(genEarlyBirdPricingForStoreQuery(storeId!)),
    queryClient.fetchQuery(
      genIndoorSimulatorStoresWithSitesQuery(
        await getAllowedStores("simulator"),
      ),
    ),
  ]);
  return {
    stores: p[1],
    earlyBirdPricing: p[0],
  };
}
