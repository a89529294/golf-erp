import {
  existingIndoorSimulatorSiteSchema,
  newIndoorSimulatorSiteSchema,
} from "@/pages/indoor-simulator/site-management/new/schemas";
import { z } from "zod";

const weekdaySchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string(),
    numberOfGroups: z.union([z.number(), z.literal("")]),
    subRows: z.array(
      z.object({
        id: z.string(),
        memberLevel: z.union([
          z.literal("guest"),
          z.literal("member"),
          z.literal("group-member"),
        ]),
        partyOf1Fee: z.union([z.number(), z.literal("")]),
        partyOf2Fee: z.union([z.number(), z.literal("")]),
        partyOf3Fee: z.union([z.number(), z.literal("")]),
        partyOf4Fee: z.union([z.number(), z.literal("")]),
      }),
    ),
    saved: z.boolean(),
  }),
);

export type MemberLevel = z.infer<
  typeof weekdaySchema
>[number]["subRows"][number]["memberLevel"];
export type WeekdayContent = z.infer<typeof weekdaySchema>[number];
export type WeekdaySubRow = z.infer<
  typeof weekdaySchema
>[number]["subRows"][number];

const obj = {
  monday: weekdaySchema,
  tuesday: weekdaySchema,
  wednesday: weekdaySchema,
  thursday: weekdaySchema,
  friday: weekdaySchema,
  saturday: weekdaySchema,
  sunday: weekdaySchema,
};

export const newGolfSiteSchema = newIndoorSimulatorSiteSchema.extend(obj);
export const existingGolfSiteSchema =
  existingIndoorSimulatorSiteSchema.extend(obj);

export type NewGolfSite = z.infer<typeof newGolfSiteSchema>;
export type ExistingGolfSite = z.infer<typeof existingGolfSiteSchema>;

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
