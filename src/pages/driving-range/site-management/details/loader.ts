import { fromImageIdsToSrc } from "@/utils";
import { ExistingDrivingRange } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { groundStoresQuery } from "../loader";
import { privateFetch } from "@/utils/utils";
import { equipments } from "@/utils/category/equipment";

const baseOpenDay = z.object({
  startDay: z.coerce.date(),
  endDay: z.coerce.date(),
  sequence: z.number(),
});

const baseOpenTime = z.object({
  startTime: z.string(),
  endTime: z.string(),
  pricePerHour: z.number(),
  openQuantity: z.number(),
  openBallQuantity: z.number(),
  sequence: z.number(),
});

const baseDrivingRangeSchema = z.object({
  id: z.string(),
  name: z.string(),
  introduce: z.string(),
  ballPrice: z.number(),
  equipment: z.string().nullable(),
  isActive: z.boolean(),
});

export const drivingRangeGETSchema = z.object({
  data: z.array(
    baseDrivingRangeSchema
      .extend({ openDays: z.array(baseOpenDay.extend({ id: z.string() })) })
      .extend({ openTimes: z.array(baseOpenTime.extend({ id: z.string() })) })
      .extend({ coverImages: z.array(z.string()) })
      .extend({ store: z.object({ id: z.string() }) }),
  ),
});

export const drivingRangePATCHSchema = baseDrivingRangeSchema
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

    console.log(drivingRangeGETSchema.safeParse(data));

    const parsed = drivingRangeGETSchema
      .parse(data)
      .data.find((v) => v.id === siteId);

    if (!parsed) throw new Error("driving range not found");

    const transformedEquipments = (() => {
      const parsedEquipments = parsed.equipment;
      if (parsedEquipments) {
        const x = JSON.parse(parsedEquipments) as {
          name: string;
          isActive: boolean;
        }[];
        return equipments.map((e) => ({
          ...e,
          selected: x.find((de) => de.name === e.label)?.isActive ?? false,
        }));
      }
      return equipments;
    })();
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
      equipments: transformedEquipments,
      imageFiles: (await fromImageIdsToSrc(parsed.coverImages)).map(
        (src, idx) => ({
          id: parsed.coverImages[idx],
          src,
        }),
      ),
      venueSettings: parsed.openTimes.map((v) => ({
        id: v.id,
        start: v.startTime.slice(11, 16),
        end: v.endTime.slice(11, 16),
        fee: v.pricePerHour,
        saved: true,
        numberOfBalls: v.openBallQuantity,
        numberOfGroups: v.openQuantity,
      })),
    };
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    details: await queryClient.ensureQueryData(
      genDrivingRangeDetailsQuery(params.storeId!, params.siteId!),
    ),
    stores: await queryClient.ensureQueryData(groundStoresQuery),
  };
}
