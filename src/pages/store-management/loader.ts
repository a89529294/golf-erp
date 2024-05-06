import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { storeCategories } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  businessHours: z.string(),
  telphone: z.string(),
  contact: z.string(),
  contactPhone: z.string(),
  category: z.enum(storeCategories),
  county: z.string(),
  district: z.string(),
  address: z.string(),
  employees: z.array(employeeSchema),
});

const storesSchema = z.object({
  data: z.array(storeSchema),
});

export type Store = z.infer<typeof storesSchema>["data"][number];

export const storesQuery = {
  queryKey: ["stores"],
  queryFn: async () => {
    const responses = await Promise.all([
      privateFetch("/store/golf?pageSize=99&populate=employees"),
      privateFetch("/store/ground?pageSize=99&populate=employees"),
      privateFetch("/store/simulator?pageSize=99&populate=employees"),
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
  return await queryClient.ensureQueryData(storesQuery);
}
