import { queryClient } from "@/utils/query-client";
import { storeCategories } from "@/utils/types";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const employeesSchema = z.object({
  data: z.array(
    z.object({
      chName: z.string(),
      id: z.string(),
      idNumber: z.string(),
      telphone: z.string(),
      stores: z.array(
        z.object({
          name: z.string(),
          category: z.enum(storeCategories),
        }),
      ),
    }),
  ),
});

export type Employee = z.infer<typeof employeesSchema>["data"][number];

export const employeesQuery = {
  queryKey: ["employees"],
  queryFn: async () => {
    const response = await privateFetch(
      "/employees?pageSize=999&populate=stores",
    );

    if (response.status === 401) throw new Error("401");

    const data = await response.json();
    const employees = employeesSchema.parse(data);

    return employees.data;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(employeesQuery);
}
