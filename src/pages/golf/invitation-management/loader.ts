import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const invitationsSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        inviteDateTime: z.coerce.date(),
        price: z.number(),
        inviteCount: z.number(),
        store: z.object({
          name: z.string(),
        }),
      }),
    ),
  })
  .transform((v) =>
    v.data.map((d) => ({
      id: d.id,
      title: d.title,
      date: `${d.inviteDateTime.getFullYear()}/${d.inviteDateTime.getMonth() + 1}/${d.inviteDateTime.getDate()}`,
      time: `${d.inviteDateTime.getHours()}:${d.inviteDateTime.getMinutes()}`,
      price: d.price,
      inviteCount: d.inviteCount,
      store: d.store.name,
    })),
  );

export type Invitation = z.infer<typeof invitationsSchema>[number];

export const invitationsQuery = {
  queryKey: ["invitations"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store/golf/invite?populate=store&pageSize=99",
    );
    const data = await response.json();

    console.log(invitationsSchema.safeParse(data));

    return invitationsSchema.parse(data);
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(invitationsQuery);
}
