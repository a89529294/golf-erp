import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { storeCategories } from "@/utils";
import { z } from "zod";
export const formSchema = z
  .object({
    code: z.string().trim().min(1, { message: "請輸入廠商編號" }),
    name: z.string().trim().min(1, { message: "請輸入廠商名稱" }),
    category: z.enum(storeCategories),
    openingHoursStart: z.string().min(1, { message: "請輸入營業時間" }),
    openingHoursEnd: z.string().min(1, { message: "請輸入營業時間" }),
    phoneAreaCode: z.string().trim(),
    phone: z.string().trim(),
    contact: z.string().trim().min(1, { message: "請填入聯絡人姓名" }),
    contactPhone: z.string().trim().min(1, { message: "請填入聯絡人電話" }),
    latitude: z.string().trim().min(1, { message: "請填入緯度" }),
    longitude: z.string().trim().min(1, { message: "請填入經度" }),
    county: z.string().min(1, { message: "請選擇縣市" }),
    district: z.string().min(1, { message: "請選擇地區" }),
    address: z.string().trim().min(1, { message: "請填入地址" }),
    employees: z.array(employeeSchema),
    merchantId: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),
    hashKey: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),
    hashIV: z
      .string()
      .nullable()
      .transform((v) => v ?? ""),
  })
  .refine(
    (schema) => {
      return schema.openingHoursEnd > schema.openingHoursStart;
    },
    {
      message: "確保結束時間晚於開始時間",
      path: ["openingHoursEnd"],
    },
  );
