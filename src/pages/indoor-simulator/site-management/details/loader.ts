import { fromImageIdsToSrc } from "@/utils";
import { ExistingIndoorSimulator } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { indoorSimulatorStoresQuery } from "../loader";
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
  sequence: z.number(),
});

const baseSimulatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  introduce: z.string(),
});

export const simulatorGETSchema = z.object({
  data: z.array(
    baseSimulatorSchema
      .extend({ openDays: z.array(baseOpenDay.extend({ id: z.string() })) })
      .extend({ openTimes: z.array(baseOpenTime.extend({ id: z.string() })) })
      .extend({ coverImages: z.array(z.string()) })
      .extend({ store: z.object({ id: z.string() }) }),
  ),
});

export const simualtorPATCHSchema = baseSimulatorSchema
  .extend({
    openDays: z.array(baseOpenDay.extend({ id: z.string().optional() })),
  })
  .extend({
    openTimes: z.array(baseOpenTime.extend({ id: z.string().optional() })),
  })
  .extend({ storeId: z.string() });

export type SimulatorGET = z.infer<typeof simulatorGETSchema>["data"][number];

export type SimulatorPATCH = z.infer<typeof simualtorPATCHSchema>;

export const genSimulatorDetailsQuery = (storeId: string, siteId: string) => ({
  queryKey: ["simulator-details", storeId, siteId],
  queryFn: async (): Promise<ExistingIndoorSimulator> => {
    const response = await privateFetch(
      `/store/${storeId}/simulator?populate=*`,
    );
    const data = await response.json();

    const parsed = simulatorGETSchema
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
      equipments: equipments,
      imageFiles: (await fromImageIdsToSrc(parsed.coverImages)).map(
        (src, idx) => ({
          id: parsed.coverImages[idx],
          src,
        }),
      ),
      openingHours: parsed.openTimes.map((v) => ({
        id: v.id,
        start: v.startTime.slice(11, 16),
        end: v.endTime.slice(11, 16),
        fee: v.pricePerHour,
        saved: true,
      })),
    };
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    details: await queryClient.ensureQueryData(
      genSimulatorDetailsQuery(params.storeId!, params.siteId!),
    ),
    stores: await queryClient.ensureQueryData(indoorSimulatorStoresQuery),
  };
}
