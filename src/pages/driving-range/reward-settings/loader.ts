import { z } from "zod";

export const pointSettingSchema = z.object({
  amoutToPointNeed: z.number(),
});
