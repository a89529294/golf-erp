import { z } from "zod";
import { memberTypeSchema, genderSchema } from "./loader";

export const memberFormSchema = z.object({
  account: z.string().trim().min(6, { message: "至少6個字" }).max(20),
  memberType: memberTypeSchema,
  chName: z.string().trim().min(1, "必填"),
  phone: z.string().trim().min(1, "必填"),
  gender: genderSchema,
  birthday: z.union([z.instanceof(Date), z.literal("")]),
});
