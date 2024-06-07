import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

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
  cardNumber: z.string(),
  appUserType: memberTypeSchema,
  chName: z.string(),
  phone: z.string(),
  gender: genderSchema,
  birthday: z.string().nullable(),
  coin: z.number(),
});

// const membersSchema = z.object({
//     data:z.array(memberSchema)
// })

export type Member = z.infer<typeof memberSchema>;
export type MemberType = Member["appUserType"];
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
    const response = await privateFetch("/app-users?pageSize=999");

    const inCompleteData = await response.json();

    const completeData = (inCompleteData.data as Member[]).map((member) => ({
      ...member,
      isActive: true,
      cardNumber: "123321",
    }));

    return completeData;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(membersQuery);
}
