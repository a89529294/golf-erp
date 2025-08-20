import { appUserTypeFromChinese } from "@/constants/appuser-type";
import { fromDateToDateTimeString } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { keepPreviousData } from "@tanstack/react-query";
import qs from "query-string";
import { z } from "zod";

export const memberTypeSchema = z.union([
  z.literal("guest"),
  z.literal("group_user"),
  z.literal("common_user"),
  z.literal("common_user1"),
  z.literal("coach"),
  z.literal("collaboration"),
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
  phone: z.string().nullable(),
  email: z.string().optional().nullable(),
  gender: genderSchema,
  birthday: z.string().nullable(),
  storeAppUsers: z
    .array(z.object({ id: z.string(), coin: z.number() }))
    .nullable()
    .optional(),
  appChargeHistories: z
    .array(
      z.object({
        id: z.string(),
        createdAt: z.coerce
          .date()
          .transform((v) => {
            v.setHours(v.getHours() - 8);
            return v;
          })
          .transform((v) => fromDateToDateTimeString(v)),
        amount: z.number(),
        store: z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .optional(),
        type: z.string(),
      }),
    )
    .optional(),
  simulatorAppointmens: z
    .array(
      z.object({
        id: z.string(),
        amount: z.number(),
        startTime: z.coerce
          .date()
          .transform((v) => fromDateToDateTimeString(v)),
        endTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
        status: z.string(),
        storeSimulator: z
          .object({
            store: z.object({ id: z.string(), name: z.string() }),
          })
          .optional(),
      }),
    )
    .optional(),
  appUserCoupons: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        expiration: z.number(),
        usedDate: z.string().nullable(),
        createdAt: z.string(),
        amount: z.number(),
        store: z
          .object({
            id: z.string(),
          })
          .nullish(),
      }),
    )
    .optional(),
});

export const simpleMemberSchema = memberSchema.omit({
  // appChargeHistories: true,
});

export const simpleMembersSchema = z.object({
  data: z.array(simpleMemberSchema),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    itemCount: z.number(),
    pageCount: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
  }),
});

export type Member = z.infer<typeof memberSchema>;
export type SimpleMember = z.infer<typeof simpleMemberSchema>;
export type MemberType = Member["appUserType"];
export type MemberAppChargeHistory = NonNullable<
  Member["appChargeHistories"]
>[number];
export type MemberAppUserCoupon = Required<Member>["appUserCoupons"][number];
export type MemberSpendingHistory =
  Required<Member>["simulatorAppointmens"][number];
export type Gender = Member["gender"];

export const memberTypeEnChMap: Record<MemberType, string> = {
  guest: "來賓",
  common_user: "一般會員",
  common_user1: "一般會員1",
  group_user: "團體會員",
  coach: "教練",
  collaboration: "協力廠商",
};

export const genderEnChMap: Record<Gender, string> = {
  male: "男",
  female: "女",
  unknown: "未知",
};

export const genMembersKey = (page: number) => ["members", page];
export const genMembersFunction = (page: number) => async () => {
  const queryString = qs.stringify({
    page: page,
    pageSize: 8,
    sort: "updatedAt",
    order: "DESC",
    populate: ["store", "storeAppUsers"],
  });
  const response = await privateFetch(`/app-users?${queryString}`);

  const data = await response.json();

  return simpleMembersSchema.parse(data);
};

export const genMembersQuery = (
  page: number,
  options: {
    sort: string;
    order: "ASC" | "DESC";
    filter: string;
    pageSize?: number;
    populate?: string[];
  },
) => {
  const sort = options.sort;
  const order = options.order;
  const filter = options.filter;
  return {
    queryKey: ["members", page, sort, order, filter],
    queryFn: async () => {
      const queryString = qs.stringify({
        page: page,
        pageSize: options.pageSize || 8,
        sort: sort,
        order: order,
        populate: options.populate ?? [],
      });
      const encodedFilter = encodeURIComponent(filter);
      const encodedAppUserType = encodeURIComponent(
        appUserTypeFromChinese[filter],
      );
      const filterString = filter
        ? `&filter[$or][account][$containsi]=${encodedFilter}&filter[$or][appUserType][$containsi]=${encodedAppUserType}&filter[$or][chName][$containsi]=${encodedFilter}&filter[$or][phone][$containsi]=${encodedFilter}&filter[$or][gender][$containsi]=${encodedFilter}&filter[$or][birthday][$containsi]=${encodedFilter}`
        : "";
      const response = await privateFetch(
        `/app-users?${queryString}${filterString}`,
      );

      const data = await response.json();

      return simpleMembersSchema.parse(data);
    },
    placeholderData: keepPreviousData,
  };
};

export const membersQuery = {
  queryKey: ["members"],
  queryFn: async () => {
    const queryString = qs.stringify({
      pageSize: 999,
      sort: "updatedAt",
      order: "DESC",
      populate: ["store", "storeAppUsers"],
    });
    const response = await privateFetch(`/app-users?${queryString}`);

    const data = await response.json();

    return simpleMembersSchema.parse(data).data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(
    genMembersQuery(1, {
      sort: "updatedAt",
      order: "DESC",
      filter: "",
    }),
  );
}
