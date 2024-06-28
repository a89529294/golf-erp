import { simpleMemberSchema } from "@/pages/member-management/loader";
import { storeSchema } from "@/utils/category/schemas";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import qs from "query-string";
import { z } from "zod";

export const invitationDetailsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    introduce: z.string(),
    inviteDateTime: z.coerce.date(),
    price: z.number(),
    inviteCount: z.number(),
    store: storeSchema,
    members: z.array(simpleMemberSchema).nullable().optional(),
    host: simpleMemberSchema.nullable().optional(),
  })
  .transform((d) => ({
    id: d.id,
    title: d.title,
    introduce: d.introduce,
    date: `${d.inviteDateTime.getFullYear().toString().padStart(2, "0")}/${(d.inviteDateTime.getMonth() + 1).toString().padStart(2, "0")}/${d.inviteDateTime.getDate().toString().padStart(2, "0")}`,
    time: `${d.inviteDateTime.getHours().toString().padStart(2, "0")}:${d.inviteDateTime.getMinutes().toString().padStart(2, "0")}`,
    price: d.price,
    inviteCount: d.inviteCount,
    store: {
      id: d.store.id,
      name: d.store.name,
      county: d.store.county,
      district: d.store.district,
      address: d.store.address,
    },
    members: d.members ? d.members : [],
    host: d.host ? [d.host] : [],
  }));

const invitationsSchema = z.object({
  data: z.array(invitationDetailsSchema),
});

export type Invitation = z.infer<typeof invitationsSchema>["data"][number];

export type InvitationPATCH = Partial<{
  title: string;
  inviteDateTime: string;
  price: number;
  inviteCount: number;
  introduce: string;
  hostId: string;
  memberIds: string[];
}>;

export const invitationsQuery = {
  queryKey: ["invitations"],
  queryFn: async () => {
    const queryString = qs.stringify({
      populate: "store",
      pageSize: 99,
      order: "DESC",
      sort: "updatedAt",
    });
    const response = await privateFetch(`/store/golf/invite?${queryString}`);
    const data = await response.json();

    return invitationsSchema.parse(data);
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(invitationsQuery);
}
