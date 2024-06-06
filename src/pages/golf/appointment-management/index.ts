import { z } from "zod";
import { Component } from "./component";
import { ErrorBoundary } from "@/components/error-boundary";
export { Component, ErrorBoundary };
export const formSchema = z.object({
  title: z.string().min(1, { message: "請填入標題" }),
  date: z.date({ message: "請選日期" }),
  time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "格式為xx:xx, 00:00 ~ 23:59",
  }),
  site: z.string().trim().min(1, { message: "請填入球場" }),
  fee: z
    .string()
    .trim()
    .refine((v) => v !== "", "請輸入費用"),
  county: z.string().min(1, "請選縣市"),
  district: z.string().min(1, "請選鄉鎮"),
  address: z.string().min(1, "請填入剩餘地址"),
  headcount: z
    .string()
    .trim()
    .refine((v) => v !== "", "請輸入費用"),
});
