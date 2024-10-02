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
    LineLink: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    IGLink: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    chargeImages: z.union([z.instanceof(FileList), z.string()]).nullable(), // for now keep it as a single value, may change to array later
    merchantId: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    hashKey: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    hashIV: z
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
