import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { storeCategories } from "@/utils";
import { z } from "zod";
export const formSchema = z
  .object({
    code: z.string().trim().min(1, { message: "請輸入廠商編號" }),
    order: z.string().trim().min(1, { message: "請輸入廠商排序" }),
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
    chargeImages: z
      .union([z.instanceof(FileList), z.string(), z.undefined()])
      .nullable(), // for now keep it as a single value, may change to array later
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
    jkoApiKey: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    jkoSercertKey: z
      .string()
      .nullish()
      .transform((v) => v ?? ""),
    jkoStoreId: z
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
    // specialPlans: z.array(
    //   z.object({
    //     day: z.number().min(1).max(7), // 1 for Monday, 7 for Sunday or similar convention
    //     timeRanges: z
    //       .array(
    //         z.object({
    //           startTime: z
    //             .string()
    //             .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    //               message: "開始時間格式不正確 (HH:mm:ss)",
    //             }),
    //           endTime: z
    //             .string()
    //             .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    //               message: "結束時間格式不正確 (HH:mm:ss)",
    //             }),
    //           discount: z
    //             .number()
    //             .min(0)
    //             .max(1, { message: "折扣必須介於0和1之間" })
    //             .optional(),
    //         }),
    //       )
    //       .optional()
    //       .superRefine((timeRangesValue, ctx) => {
    //         if (!timeRangesValue) return;
    //         timeRangesValue.forEach((range, index) => {
    //           if (range.startTime && range.endTime && range.endTime <= range.startTime) {
    //             ctx.addIssue({
    //               code: z.ZodIssueCode.custom,
    //               message: "結束時間必須晚於開始時間",
    //               path: [index, "endTime"],
    //             });
    //             // Optionally, add a corresponding issue to startTime for more specific feedback
    //             // ctx.addIssue({
    //             //   code: z.ZodIssueCode.custom,
    //             //   message: "開始時間必須早於結束時間",
    //             //   path: [index, "startTime"],
    //             // });
    //           }
    //         });
    //       }),
    //   }),
    // ),
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
