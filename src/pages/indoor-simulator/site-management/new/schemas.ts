import { z } from "zod";

export const fileWithIdSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
});

export type FileWithId = z.infer<typeof fileWithIdSchema>;

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageFiles: z.array(fileWithIdSchema),
  openingDates: z.array(
    z.object({
      id: z.string(),
      start: z.date().optional(),
      end: z.date().optional(),
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

export type DateRange = z.infer<typeof formSchema>["openingDates"][number];
export type TimeRange = z.infer<typeof formSchema>["openingHours"][number];
