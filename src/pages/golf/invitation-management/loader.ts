import { simpleMemberSchema } from "@/pages/member-management/loader";
import { storeSchema } from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
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
    date: `${d.inviteDateTime.getFullYear()}/${d.inviteDateTime.getMonth() + 1}/${d.inviteDateTime.getDate()}`,
    time: `${d.inviteDateTime.getHours()}:${d.inviteDateTime.getMinutes()}`,
    price: d.price,
    inviteCount: d.inviteCount,
    store: {
      id: d.store.id,
      name: d.store.name,
      county: d.store.county,
      district: d.store.district,
      address: d.store.address,
    },
    members: d.members?.map((m) => ({ id: m.id, name: m.chName })),
    host: d.host,
  }));

const invitationsSchema = z.object({
  data: z.array(invitationDetailsSchema),
});

export type Invitation = z.infer<typeof invitationsSchema>["data"][number];

export const invitationsQuery = {
  queryKey: ["invitations"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store/golf/invite?populate=store&pageSize=99",
    );
    const data = await response.json();

    return invitationsSchema.parse(data);
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(invitationsQuery);
}
