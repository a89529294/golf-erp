import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const storesSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      county: z.string(),
      district: z.string(),
      address: z.string(),
    }),
  ),
});

export type Store = z.infer<typeof storesSchema>["data"][number];

export const storeQuery = {
  queryKey: ["stores"],
  queryFn: async () => {
    const responses = await Promise.all([
      privateFetch("/store/golf?pageSize=99"),
      privateFetch("/store/ground?pageSize=99"),
      privateFetch("/store/simulator?pageSize=99"),
    ]);

    const x = {
      golf: storesSchema.parse(await responses[0].json()).data,
      ground: storesSchema.parse(await responses[1].json()).data,
      simulator: storesSchema.parse(await responses[2].json()).data,
    };

    return x;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(storeQuery);
}
