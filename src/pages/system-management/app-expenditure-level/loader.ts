import { storeCategories } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const responseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      minConsumption: z.number(),
      maxConsumption: z.number(),
      canAppointDays: z.number(),
      category: z.enum(storeCategories),
    }),
  ),
});

export const expenditureLevelQuery = {
  queryKey: ["expenditure-level"],
  queryFn: async () => {
    const response = await privateFetch("/consumer-grade?pageSize=999");
    const data = responseSchema.parse(await response.json()).data;

    return data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData({ ...expenditureLevelQuery });
}
