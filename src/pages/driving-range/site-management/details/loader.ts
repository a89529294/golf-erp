import {
  equipmentSchema,
  ExistingDrivingRange,
  plansSchema,
  storeSchema,
} from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

const baseOpenDay = z.object({
  startDay: z.coerce.date(),
  endDay: z.coerce.date(),
  sequence: z.number(),
});

const baseOpenTime = z.object({
  startTime: z.string(),
  endTime: z.string(),
  sequence: z.number(),
});

const baseDrivingRangeSchema = z.object({
  id: z.string(),
  name: z.string(),
  introduce: z.string(),
  ballPrice: z.number(),
  plans: plansSchema.plans.optional(),
  equipments: z.array(equipmentSchema),
  isActive: z.boolean(),
});

export const drivingRangeGETSchema = z.object({
  data: z.array(
    baseDrivingRangeSchema
      .extend({ openDays: z.array(baseOpenDay.extend({ id: z.string() })) })
      .extend({ openTimes: z.array(baseOpenTime.extend({ id: z.string() })) })
      .extend({ coverImages: z.array(z.string()) })
      .extend({ store: storeSchema }),
  ),
});

export const drivingRangePATCHSchema = baseDrivingRangeSchema
  .extend({ equipmentIds: z.array(z.string()) })
  .extend({
    openDays: z.array(baseOpenDay.extend({ id: z.string().optional() })),
  })
  .extend({
    openTimes: z.array(baseOpenTime.extend({ id: z.string().optional() })),
  })
  .extend({ storeId: z.string() });

export type DrivingRangeGET = z.infer<
  typeof drivingRangeGETSchema
>["data"][number];

export type DrivingRangePATCH = z.infer<typeof drivingRangePATCHSchema>;

export const genDrivingRangeDetailsQuery = (
  storeId: string,
  siteId: string,
) => ({
  queryKey: ["driving-range-details", storeId, siteId],
  queryFn: async (): Promise<ExistingDrivingRange> => {
    const response = await privateFetch(`/store/${storeId}/ground?populate=*`);
    const data = await response.json();

    const parsed = drivingRangeGETSchema
      .parse(data)
      .data.find((v) => v.id === siteId);

    if (!parsed) throw new Error("driving range not found");

    return {
      name: parsed.name,
      isActive: parsed.isActive,
      description: parsed.introduce,
      storeId: parsed.store.id,
      openingDates: parsed.openDays.map((v) => ({
        id: v.id,
        saved: true,
        start: v.startDay,
        end: v.endDay,
      })),
      costPerBox: parsed.ballPrice,
      equipments: parsed.equipments,
      imageFiles: parsed.coverImages.map((src) => ({
        id: src,
        src,
      })),
      venueSettings: parsed.openTimes.map((v) => ({
        id: v.id,
        start: v.startTime,
        end: v.endTime,
        saved: true,
      })),
      store: parsed.store,
      plans: parsed.plans?.map((p) => ({ ...p, saved: true })) ?? [],
    };
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    details: await queryClient.ensureQueryData(
      genDrivingRangeDetailsQuery(params.storeId!, params.siteId!),
    ),
  };
}
