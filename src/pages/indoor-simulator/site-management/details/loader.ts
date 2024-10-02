import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { getAllowedStores } from "@/utils";
import {
  equipmentSchema,
  ExistingIndoorSimulator,
  plansSchema,
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

const baseSimulatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  introduce: z.string(),
  equipments: z.array(equipmentSchema),
  plans: plansSchema.plans.optional(),
  isActive: z.boolean(),
});

export const simulatorGETSchema = z.object({
  data: z.array(
    baseSimulatorSchema
      .extend({ openDays: z.array(baseOpenDay.extend({ id: z.string() })) })
      .extend({ openTimes: z.array(baseOpenTime) })
      .extend({ coverImages: z.array(z.string()) })
      .extend({ bannerImages: z.array(z.string()).nullish() })
      .extend({ store: z.object({ id: z.string() }) })
      .extend({ code: z.string() }),
  ),
});

export const simulatorPATCHSchema = baseSimulatorSchema
  .extend({ equipmentIds: z.array(z.string()) })
  .extend({
    openDays: z.array(baseOpenDay.extend({ id: z.string().optional() })),
  })
  .extend({
    openTimes: z.array(baseOpenTime),
  })
  .extend({ storeId: z.string() });

export type SimulatorGET = z.infer<typeof simulatorGETSchema>["data"][number];

export type SimulatorPATCH = z.infer<typeof simulatorPATCHSchema>;

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
      code: parsed.code,
      isActive: parsed.isActive,
      introduce: parsed.introduce,
      storeId: parsed.store.id,
      equipments: parsed.equipments,
      openingDates: parsed.openDays.map((v) => ({
        id: v.id,
        saved: true,
        start: v.startDay,
        end: v.endDay,
      })),
      imageFiles: parsed.coverImages.map((id) => ({ id: id, src: id })),
      bannerImages: (parsed.bannerImages ?? []).map((id) => ({
        id: id,
        src: id,
      })),
      ...(parsed.openTimes && parsed.openTimes[0]
        ? {
            openingHours: [
              {
                start: parsed.openTimes[0].startTime,
                end: parsed.openTimes[0].endTime,
                saved: true,
              },
            ],
          }
        : {
            openingHours: [],
          }),
      plans: parsed.plans?.map((p) => ({ ...p, saved: true })) ?? [],
    };
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    details: await queryClient.ensureQueryData(
      genSimulatorDetailsQuery(params.storeId!, params.siteId!),
    ),
    stores: await queryClient.ensureQueryData(
      indoorSimulatorStoresQuery(await getAllowedStores("simulator")),
    ),
  };
}
