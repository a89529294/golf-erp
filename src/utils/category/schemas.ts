import { z } from "zod";

const fileWithIdSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
});
type FileWithId = z.infer<typeof fileWithIdSchema>;
const existingImgSchema = z.object({
  id: z.string(),
  src: z.string(),
});
type ExistingImg = z.infer<typeof existingImgSchema>;

const nameSchema = { name: z.string().min(1) };
const descriptionSchema = { description: z.string().min(1) };

const baseSchema = z.object({}).extend(nameSchema).extend(descriptionSchema);

const equipmentsSchema = {
  equipments: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      selected: z.boolean(),
    }),
  ),
};
const newImagesSchema = { imageFiles: z.array(fileWithIdSchema) };
const existingImagesSchema = {
  imageFiles: z.array(z.union([existingImgSchema, fileWithIdSchema])),
};
const openingDatesSchema = {
  openingDates: z.array(
    z.object({
      id: z.string(),
      start: z.union([z.date(), z.undefined()]),
      end: z.union([z.date(), z.undefined()]),
      saved: z.boolean(),
    }),
  ),
};
type DateRange = z.infer<typeof openingDatesSchema.openingDates>[number];
const openingHoursSchema = {
  openingHours: z.array(
    z.object({
      id: z.string(),
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      fee: z.union([z.number(), z.literal("")]),
      saved: z.boolean(),
    }),
  ),
};
type TimeRange = z.infer<(typeof openingHoursSchema)["openingHours"]>[number];
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
type WeekdayContent = z.infer<typeof weekdaySchema>[number];
type WeekdaySubRow = WeekdayContent["subRows"][number];
type MemberLevel = WeekdaySubRow["memberLevel"];
const weekDaysSchema = {
  monday: weekdaySchema,
  tuesday: weekdaySchema,
  wednesday: weekdaySchema,
  thursday: weekdaySchema,
  friday: weekdaySchema,
  saturday: weekdaySchema,
  sunday: weekdaySchema,
};
const weekdays = [
  { en: "monday", cn: "星期一" },
  { en: "tuesday", cn: "星期二" },
  { en: "wednesday", cn: "星期三" },
  { en: "thursday", cn: "星期四" },
  { en: "friday", cn: "星期五" },
  { en: "saturday", cn: "星期六" },
  { en: "sunday", cn: "星期日" },
] as const;
type Weekday = (typeof weekdays)[number]["en"];
const venueSettingsSchema = {
  venueSettings: z.array(
    z.object({
      id: z.string(),
      start: z.string(),
      end: z.string(),
      fee: z.union([z.literal(""), z.number()]),
      numberOfGroups: z.union([z.literal(""), z.number()]),
      numberOfBalls: z.union([z.literal(""), z.number()]),
      saved: z.boolean(),
    }),
  ),
};
type VenueSettingsRowContent = z.infer<
  (typeof venueSettingsSchema)["venueSettings"]
>[number];
const costPerBoxSchema = {
  costPerBox: z.number(),
};

const newIndoorSimulatorSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(openingDatesSchema)
  .extend(openingHoursSchema);
type NewIndoorSimulator = z.infer<typeof newIndoorSimulatorSchema>;

const existingIndoorSimulatorSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend(openingDatesSchema)
  .extend(openingHoursSchema);
type ExistingIndoorSimulator = z.infer<typeof existingIndoorSimulatorSchema>;

const newGolfCourseSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(openingDatesSchema)
  .extend(weekDaysSchema);
type NewGolfCourse = z.infer<typeof newGolfCourseSchema>;

const existingGolfCourseSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend(openingDatesSchema)
  .extend(weekDaysSchema);
type ExistingGolfCourse = z.infer<typeof existingGolfCourseSchema>;

const newDrivingRangeSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(openingDatesSchema)
  .extend(venueSettingsSchema)
  .extend(costPerBoxSchema);
type NewDrivingRange = z.infer<typeof newDrivingRangeSchema>;

const existingDrivingRangeSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend(openingDatesSchema)
  .extend(venueSettingsSchema)
  .extend(costPerBoxSchema);
type ExistingDrivingRange = z.infer<typeof existingDrivingRangeSchema>;

export {
  weekdays,
  type Weekday,
  type WeekdayContent,
  type WeekdaySubRow,
  type MemberLevel,
  type DateRange,
  type TimeRange,
  type VenueSettingsRowContent,
  type FileWithId,
  type ExistingImg,
  type ExistingIndoorSimulator,
  type ExistingGolfCourse,
  type NewIndoorSimulator,
  type NewGolfCourse,
  type NewDrivingRange,
  type ExistingDrivingRange,
  newIndoorSimulatorSchema,
  existingIndoorSimulatorSchema,
  newGolfCourseSchema,
  existingGolfCourseSchema,
  newDrivingRangeSchema,
  existingDrivingRangeSchema,
};
