import { fromDateToDateTimeString } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";
import qs from "query-string";

export const memberTypeSchema = z.union([
  z.literal("guest"),
  z.literal("group_user"),
  z.literal("common_user"),
]);

export const genderSchema = z.union([
  z.literal("male"),
  z.literal("female"),
  z.literal("unknown"),
]);

export const memberSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  account: z.string(),
  appUserType: memberTypeSchema,
  chName: z.string(),
  phone: z.string(),
  gender: genderSchema,
  birthday: z.string().nullable(),
  coin: z.number(),
  appChargeHistories: z.array(
    z.object({
      id: z.string(),
      createdAt: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
      amount: z.number(),
    }),
  ),
});

export const simpleMemberSchema = memberSchema.omit({
  appChargeHistories: true,
});

export const simpleMembersSchema = z.object({
  data: z.array(simpleMemberSchema),
});

export type Member = z.infer<typeof memberSchema>;
export type SimpleMember = z.infer<typeof simpleMemberSchema>;
export type MemberType = Member["appUserType"];
export type MemberAppChargeHistory = Member["appChargeHistories"][number];
export type Gender = Member["gender"];

export const memberTypeEnChMap: Record<MemberType, string> = {
  guest: "來賓",
  common_user: "一般會員",
  group_user: "團體會員",
};

export const genderEnChMap: Record<Gender, string> = {
  male: "男",
  female: "女",
  unknown: "未知",
};

export const membersQuery = {
  queryKey: ["members"],
  queryFn: async () => {
    const queryString = qs.stringify({
      pageSize: 999,
      sort: "updatedAt",
      order: "DESC",
    });
    const response = await privateFetch(`/app-users?${queryString}`);

    const data = await response.json();

    return simpleMembersSchema.parse(data).data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(membersQuery);
}
