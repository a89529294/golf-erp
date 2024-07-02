import { fromDateToDateTimeString } from "@/utils";
import { z } from "zod";

const baseAppointmentSchema = z.object({
  id: z.string(), // appointmentId
  startTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
  endTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
  status: z
    .union([z.literal("pending"), z.literal("complete"), z.literal("cancel")])
    .transform((v) => {
      if (v === "pending") return "進行中";
      if (v === "complete") return "完成";
      return "取消";
    }),
  order: z
    .union([z.literal("success"), z.literal("pending")])
    .transform((v) => {
      if (v === "success") return "完成";
      return "進行中";
    })
    .optional(),
  appUser: z.object({
    id: z.string(),
    chName: z.string(),
    phone: z.string(),
  }),
});

export const simulatorAppoitmentsSchema = z.object({
  data: z.array(
    baseAppointmentSchema.extend({
      storeSimulator: z.object({
        id: z.string(), // site id,
        name: z.string(),
        store: z.object({
          id: z.string(), // store id
        }),
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
        store: z.object({
          id: z.string(), // store id
        }),
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
