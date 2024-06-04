import { fromImageIdsToSrc } from "@/utils";
import { ExistingDrivingRange } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { groundStoresQuery } from "../loader";
import { privateFetch } from "@/utils/utils";

const detailedDrivingRangeSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      coverImages: z.array(z.string()),
      introduce: z.string(),
      ballPrice: z.number(),
      openDays: z.array(
        z.object({
          id: z.string(),
          startDay: z.coerce.date(),
          endDay: z.coerce.date(),
          sequence: z.number(),
        }),
      ),
      openTimes: z.array(
        z.object({
          id: z.string(),
          startTime: z.string(),
          endTime: z.string(),
          pricePerHour: z.number(),
          openQuantity: z.number(),
          openBallQuantity: z.number(),
          sequence: z.number(),
        }),
      ),
      store: z.object({
        id: z.string(),
      }),
    }),
  ),
});

export const genDrivingRangeDetailsQuery = (
  storeId: string,
  siteId: string,
) => ({
  queryKey: ["driving-range-details", storeId, siteId],
  queryFn: async (): Promise<ExistingDrivingRange> => {
    const response = await privateFetch(`/store/${storeId}/ground?populate=*`);
    const data = await response.json();

    const parsed = detailedDrivingRangeSchema
      .parse(data)
      .data.find((v) => v.id === siteId);

    if (!parsed) throw new Error("driving range not found");
    return {
      name: parsed.name,
      description: parsed.introduce,
      storeId: parsed.store.id,
      openingDates: parsed.openDays.map((v) => ({
        id: v.id,
        saved: true,
        start: v.startDay,
        end: v.endDay,
      })),
      costPerBox: parsed.ballPrice,
      equipments: [],
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
