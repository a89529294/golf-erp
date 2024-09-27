import { fromDateToDateTimeString } from "@/utils";
import { z } from "zod";

export const baseAppointmentSchema = z.object({
  id: z.string(), // appointmentId
  amount: z.number(),
  startTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
  endTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
  status: z
    .union([
      z.literal("pending"),
      z.literal("complete"),
      z.literal("cancel"),
      z.literal("overtime"),
    ])
    .transform((v) => {
      if (v === "pending") return "進行中";
      if (v === "complete") return "完成";
      if (v === "overtime") return "過期";
      return "取消";
    }),
  order: z
    .object({
      id: z.string(),
      paymentMethod: z.string().nullish(),
    })
    .optional(),
  appUser: z
    .object({
      id: z.string(),
      chName: z.string(),
      phone: z
        .string()
        .nullish()
        .transform((v) => v ?? undefined),
    })
    .optional(),
  usedCoupon: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number(),
        number: z.string(),
      }),
    )
    .nullish(),
  originAmount: z.number().nullish(),
});

export const simulatorAppoitmentsSchema = z.object({
  data: z.array(
    baseAppointmentSchema.extend({
      storeSimulator: z.object({
        id: z.string(), // site id,
        name: z.string(),
        store: z.optional(
          z.object({
            id: z.string(), // store id
          }),
        ),
      }),
    }),
  ),
});

export const groundAppoitmentsSchema = z.object({
  data: z.array(
    baseAppointmentSchema.extend({
      storeGround: z.object({
        id: z.string(), // site id,
        name: z.string(),
        store: z.optional(
          z.object({
            id: z.string(), // store id
          }),
        ),
      }),
    }),
  ),
});

export type StoreWithSiteAppointments = {
  id: string;
  sites: {
    id: string;
    name: string;
    appointments: z.infer<typeof baseAppointmentSchema>[];
  }[];
};

export type Appointment =
  StoreWithSiteAppointments["sites"][number]["appointments"][number];
