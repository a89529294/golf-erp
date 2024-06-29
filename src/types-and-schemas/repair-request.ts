import { z } from "zod";

const repairRequestBaseSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: z.union([
    z.literal("pending"),
    z.literal("complete"),
    z.literal("no-problem"),
  ]),
  // .transform((v) => {
  //   if (v === "pending") return "進行中";
  //   if (v === "complete") return "已完成";
  //   return "無須處理";
  // }),
});

const simulatorRepairRequestsSchema = z.object({
  data: z.array(
    repairRequestBaseSchema.extend({
      storeSimulator: z.object({
        id: z.string(),
        name: z.string(),
        store: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
    }),
  ),
});

const groundRepairRequestsSchema = z.object({
  data: z.array(
    repairRequestBaseSchema.extend({
      storeGround: z.object({
        id: z.string(),
        name: z.string(),
        store: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
    }),
  ),
});

const golfRepairRequestsSchema = z.object({
  data: z.array(
    repairRequestBaseSchema.extend({
      storeGolf: z.object({
        id: z.string(),
        name: z.string(),
        store: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
    }),
  ),
});

type SimulatorRepairRequest = z.infer<
  typeof simulatorRepairRequestsSchema
>["data"][number];

type GolfRepairRequest = z.infer<
  typeof golfRepairRequestsSchema
>["data"][number];

type GroundRepairRequest = z.infer<
  typeof groundRepairRequestsSchema
>["data"][number];

export {
  golfRepairRequestsSchema,
  simulatorRepairRequestsSchema,
  groundRepairRequestsSchema,
  type SimulatorRepairRequest,
  type GolfRepairRequest,
  type GroundRepairRequest,
};
