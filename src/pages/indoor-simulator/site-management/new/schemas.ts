import { z } from "zod";

export const fileWithIdSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
});
export const existingImgSchema = z.object({
  id: z.string(),
  src: z.string(),
});

export type FileWithId = z.infer<typeof fileWithIdSchema>;
export type ExistingImg = z.infer<typeof existingImgSchema>;

const baseIndoorSimulatorSiteSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  openingDates: z.array(
    z.object({
      id: z.string(),
      start: z.union([z.date(), z.undefined()]),
      end: z.union([z.date(), z.undefined()]),
      saved: z.boolean(),
    }),
  ),
  openingHours: z.array(
    z.object({
      id: z.string(),
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      fee: z.union([z.number(), z.literal("")]),
      saved: z.boolean(),
    }),
  ),
});

export const newIndoorSimulatorSiteSchema =
  baseIndoorSimulatorSiteSchema.extend({
    imageFiles: z.array(fileWithIdSchema),
  });

export const existingIndoorSimulatorSiteSchema =
  baseIndoorSimulatorSiteSchema.extend({
    imageFiles: z.array(z.union([existingImgSchema, fileWithIdSchema])),
  });

export type BaseNewSite = z.infer<typeof newIndoorSimulatorSiteSchema>;

export type DateRange = z.infer<
  typeof baseIndoorSimulatorSiteSchema
>["openingDates"][number];
export type TimeRange = z.infer<
  typeof baseIndoorSimulatorSiteSchema
>["openingHours"][number];
