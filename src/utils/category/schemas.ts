import { MemberType } from "@/pages/member-management/members/loader";
import { z } from "zod";
import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { storeCategories } from "@/utils";

export const storeSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  businessHours: z.string().nullable(),
  telphone: z.string().nullable(),
  contact: z.string().nullable(),
  contactPhone: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  category: z.enum(storeCategories),
  county: z.string(),
  district: z.string(),
  address: z.string(),
  employees: z.array(employeeSchema).optional(),
  merchantId: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  hashKey: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  linepayChannelId: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  linepayChannelSecret: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  hashIV: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  invoiceMerchantId: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  invoiceHashKey: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  invoiceHashIV: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
});

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

const nameSchema = { name: z.string().min(1, { message: "請填入場地名" }) };
const descriptionSchema = {
  description: z.string().min(1, { message: "請填入場地簡介" }),
};
const storeIdSchema = { storeId: z.string().min(1, { message: "請綁定廠商" }) };
const openingDatesSchema = {
  openingDates: z.array(
    z.object({
      id: z.string(),
      start: z.union([z.date(), z.undefined()]).refine((v) => v),
      end: z.union([z.date(), z.undefined()]).refine((v) => v),
      saved: z.boolean().refine((v) => v),
    }),
  ),
};
const baseSchema = z
  .object({ isActive: z.boolean() })
  .extend(nameSchema)
  .extend(descriptionSchema)
  .extend(storeIdSchema)
  .extend(openingDatesSchema);

export const equipmentSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const equipmentsSchema = {
  equipments: z.array(equipmentSchema),
};
const newImagesSchema = { imageFiles: z.array(fileWithIdSchema) };
const existingImagesSchema = {
  imageFiles: z.array(z.union([existingImgSchema, fileWithIdSchema])),
};

type DateRange = z.infer<typeof openingDatesSchema.openingDates>[number];
const openingHoursSchema = {
  openingHours: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
      saved: z.boolean(),
    }),
  ),
};
type TimeRange = Exclude<
  z.infer<(typeof openingHoursSchema)["openingHours"]>,
  undefined
>;

const plansSchema = {
  plans: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "請填寫名稱"),
        hours: z
          .union([z.number(), z.string()])
          .refine((v) => v !== "", { message: "請填寫時數" }),
        price: z
          .union([z.number(), z.string()])
          .refine((v) => v !== "", { message: "請填寫價錢" }),
        saved: z.boolean().optional(),
      }),
    )
    .optional(),
};
type Plan = Exclude<z.infer<(typeof plansSchema)["plans"]>, undefined>[number];

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
          z.literal("group_user"),
          z.literal("common_user"),
          z.literal("coach"),
          z.literal("collaboration"),
        ]),
        partyOf1Fee: z.union([z.number(), z.literal("")]),
        partyOf2Fee: z.union([z.number(), z.literal("")]),
        partyOf3Fee: z.union([z.number(), z.literal("")]),
        partyOf4Fee: z.union([z.number(), z.literal("")]),
      }),
    ),
    saved: z.boolean().refine((v) => v),
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
      saved: z.boolean(),
    }),
  ),
};
type VenueSettingsRowContent = z.infer<
  (typeof venueSettingsSchema)["venueSettings"]
>[number];
const costPerBoxSchema = {
  costPerBox: z.number().min(1, { message: "請填入價錢" }),
};

const newIndoorSimulatorSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(openingHoursSchema)
  .extend(plansSchema);
type NewIndoorSimulator = z.infer<typeof newIndoorSimulatorSchema> & {
  category: "indoor-simulator";
};

const existingIndoorSimulatorSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend(openingHoursSchema)
  .extend(plansSchema)
  .extend({
    code: z.string(),
  });
type ExistingIndoorSimulator = z.infer<typeof existingIndoorSimulatorSchema>;

const newGolfCourseSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(weekDaysSchema);
type NewGolfCourse = z.infer<typeof newGolfCourseSchema> & { category: "golf" };

const existingGolfCourseSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend({
    store: storeSchema,
  })
  .extend(weekDaysSchema);
type ExistingGolfCourse = z.infer<typeof existingGolfCourseSchema>;

const newDrivingRangeSchema = baseSchema
  .extend(equipmentsSchema)
  .extend(newImagesSchema)
  .extend(venueSettingsSchema)
  .extend(costPerBoxSchema)
  .extend(plansSchema);
type NewDrivingRange = z.infer<typeof newDrivingRangeSchema> & {
  category: "driving-range";
};

const existingDrivingRangeSchema = baseSchema
  .extend({
    store: storeSchema,
  })
  .extend(equipmentsSchema)
  .extend(existingImagesSchema)
  .extend(venueSettingsSchema)
  .extend(costPerBoxSchema)
  .extend(plansSchema);
type ExistingDrivingRange = z.infer<typeof existingDrivingRangeSchema>;

const genericSitesSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  coverImages: z.array(z.string()),
  introduce: z.string(),
  equipments: z.array(equipmentSchema),
  store: storeSchema,
  openDays: z
    .array(
      z.object({
        id: z.string(),
        startDay: z.string(),
        endDay: z.string(),
        sequence: z.number(),
      }),
    )
    .optional(),
});

export const groundSitesSchema = z.object({
  data: z.array(
    genericSitesSchema.partial({ store: true }).extend({
      openTimes: z
        .array(
          z.object({
            id: z.string(),
            startTime: z.string(),
            endTime: z.string(),
            pricePerHour: z
              .number()
              .optional()
              .transform((v) => v ?? 0),
            openQuantity: z
              .number()
              .optional()
              .transform((v) => v ?? 0),
            openBallQuantity: z
              .number()
              .optional()
              .transform((v) => v ?? 0),
            sequence: z.number(),
          }),
        )
        .optional(),
    }),
  ),
});

export const simulatorSitesSchema = z.object({
  data: z.array(
    genericSitesSchema.partial({ store: true }).extend({
      openTimes: z
        .array(
          z.object({
            id: z.string(),
            startTime: z.string(),
            endTime: z.string(),
            sequence: z.number(),
          }),
        )
        .optional(),
      plans: plansSchema.plans.optional(),
    }),
  ),
});
export const golfSitesSchema = z.object({
  data: z.array(
    genericSitesSchema.partial({ store: true }).extend({
      openTimes: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            day: z.union([
              z.literal(0),
              z.literal(1),
              z.literal(2),
              z.literal(3),
              z.literal(4),
              z.literal(5),
              z.literal(6),
            ]),
            openQuantity: z.number(),
            sequence: z.number(),
            startTime: z.string(),
            endTime: z.string(),
            pricePerHour: z.string().transform((v) => {
              const data = JSON.parse(v) as {
                membershipType: MemberType;
                "1": number;
                "2": number;
                "3": number;
                "4": number;
              }[];

              return data;
            }),
          }),
        )
        .optional(),
    }),
  ),
});

type Equipment = {
  name: string;
  isActive: boolean;
};

export {
  type Equipment,
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
  type Plan,
  newIndoorSimulatorSchema,
  existingIndoorSimulatorSchema,
  newGolfCourseSchema,
  existingGolfCourseSchema,
  newDrivingRangeSchema,
  existingDrivingRangeSchema,
  genericSitesSchema,
  plansSchema,
};
