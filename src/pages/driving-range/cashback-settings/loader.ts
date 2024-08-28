import { z } from "zod";

export const chargeDiscountSchema = z.object({
  id: z.string(),
  title: z.string(),
  chargeAmount: z.number(),
  extraAmount: z.number(),
});

export const chargeDiscountsSchema = z.array(chargeDiscountSchema);

export type ChargeDiscount = z.infer<typeof chargeDiscountSchema>;
