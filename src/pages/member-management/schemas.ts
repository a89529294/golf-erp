import { z } from "zod";
import { memberTypeSchema, genderSchema } from "./loader";

export const memberFormSchema = z.object({
  cardNumber: z.string().min(1),
  memberType: memberTypeSchema,
  chName: z.string().min(1),
  phone: z.string().min(1),
  gender: genderSchema,
  birthday: z.union([z.instanceof(Date), z.literal("")]),
});
