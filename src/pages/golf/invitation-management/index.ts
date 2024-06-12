import { z } from "zod";
import { Component } from "./component";
import { ErrorBoundary } from "@/components/error-boundary";
import { simpleMemberSchema } from "@/pages/member-management/loader";
export { Component, ErrorBoundary };
export { loader } from "./loader";

export const formSchema = z
  .object({
    title: z.string().min(1, { message: "請填入標題" }),
    introduce: z.string().min(1, { message: "請填入介紹" }),
    date: z.date({ message: "請選日期" }),
    time: z.string().min(1, { message: "請選擇時段" }),
    storeId: z.string().trim().min(1, { message: "請選擇球場" }),
    price: z.coerce
      .string()
      .trim()
      .refine((v) => v !== "", "請輸入費用"),
    county: z.string(),
    district: z.string(),
    address: z.string(),
    headcount: z
      .string()
      .trim()
      .refine(
        (v) => v !== "" && +v !== 0,
        (v) => ({
          message: v === "" ? "請填入人數" : "人數不可為0",
        }),
      ),
    host: z
      .array(simpleMemberSchema)
      .refine((v) => v.length === 1, "請選擇主辦人"),
    members: z.array(simpleMemberSchema),
  })
  .refine(
    (schema) => {
      return +schema.headcount - 1 >= schema.members.length;
    },
    {
      path: ["headcount"],
      message: "參與人數過多",
    },
  );
