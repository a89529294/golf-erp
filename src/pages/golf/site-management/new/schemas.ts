import { newIndoorSimulatorSiteSchema } from "@/pages/indoor-simulator/site-management/new/schemas";
import { z } from "zod";

const weekDaySchema = z.object({
  id: z.string(),
  start: z.string(),
  end: z.string(),
  fee: z.union([z.number(), z.literal("")]),
  numberOfGroups: z.union([z.number(), z.literal("")]),
  numberOfGolfBalls: z.union([z.number(), z.literal("")]),
  saved: z.boolean(),
});

export type WeekDayContent = z.infer<typeof weekDaySchema>;

export const newGolfSiteSchema = newIndoorSimulatorSiteSchema.extend({
  monday: z.array(weekDaySchema),
  tuesday: z.array(weekDaySchema),
  wednesday: z.array(weekDaySchema),
  thursday: z.array(weekDaySchema),
  friday: z.array(weekDaySchema),
  saturday: z.array(weekDaySchema),
  sunday: z.array(weekDaySchema),
});

export type NewGolfSite = z.infer<typeof newGolfSiteSchema>;

export const weekdays = [
  { en: "monday", cn: "星期一" },
  { en: "tuesday", cn: "星期二" },
  { en: "wednesday", cn: "星期三" },
  { en: "thursday", cn: "星期四" },
  { en: "friday", cn: "星期五" },
  { en: "saturday", cn: "星期六" },
  { en: "sunday", cn: "星期日" },
] as const;
export type Weekday = (typeof weekdays)[number]["en"];
