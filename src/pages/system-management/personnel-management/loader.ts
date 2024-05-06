import { storeCategories } from "@/utils";
import { queryClient } from "@/utils/query-client";
import {} from "@/utils/types";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const employeeSchema = z.object({
  chName: z.string(),
  id: z.string(),
  idNumber: z.string(),
  telphone: z.string(),
  stores: z
    .array(
      z.object({
        name: z.string(),
        category: z.enum(storeCategories),
      }),
    )
    .optional(),
});

const employeesSchema = z.object({
  data: z.array(employeeSchema),
});

export type Employee = z.infer<typeof employeesSchema>["data"][number];

export const genEmployeesQuery = (nonERPUsers?: boolean) => {
  return {
    queryKey: nonERPUsers ? ["employees", "non-erp-users"] : ["employees"],
    queryFn: async () => {
      const response = await privateFetch(
        `/employees?pageSize=999&populate=stores${nonERPUsers ? "&populate=user&filter[user][$null]" : ""}`,
      );

      const data = await response.json();
      const employees = employeesSchema.parse(data);

      return employees.data;
    },
  };
};

export async function loader() {
  return await queryClient.ensureQueryData(genEmployeesQuery());
}
