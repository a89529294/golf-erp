import { storeCategories } from "@/utils";
import { z } from "zod";

export const formSchema = z.object({
  idNumber: z.string().min(1, { message: "請填入編號" }),
  name: z.string().min(1, { message: "請填入姓名" }),
  phoneno: z.string().min(1, { message: "請填入電話" }),
  category: z.enum(storeCategories),
  storeId: z.union([z.string(), z.undefined()]),
});
