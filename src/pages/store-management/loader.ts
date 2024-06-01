import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { storeCategories } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  businessHours: z.string().nullable(),
  telphone: z.string().nullable(),
  contact: z.string().nullable(),
  contactPhone: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  category: z.enum(storeCategories),
  county: z.string(),
  district: z.string(),
  address: z.string(),
  employees: z.array(employeeSchema),
});

export const storesSchema = z.object({
  data: z.array(storeSchema),
});

export const storesWithoutEmployeesSchema = z.object({
  data: z.array(storeSchema.omit({ employees: true })),
});

export type Store = z.infer<typeof storesSchema>["data"][number];
export type StoreWithoutEmployees = z.infer<
  typeof storesWithoutEmployeesSchema
>["data"][number];

export const storesQuery = {
  queryKey: ["stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&populate=employees",
    );

    const data = storesSchema.parse(await response.json()).data;

    const x = {
      golf: data.filter((s) => s.category === "golf"),
      ground: data.filter((s) => s.category === "ground"),
      simulator: data.filter((s) => s.category === "simulator"),
    };

    return x;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(storesQuery);
}
