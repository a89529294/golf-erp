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
        id: z.string(),
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

export const genEmployeesQuery = (
  criteria?: "non-erp-users" | "employees-with-no-store" | undefined,
) => {
  const keyMap = {
    "non-erp-users": ["employees", "non-erp-users"],
    "employees-with-no-store": ["employees", "no-store"],
  };

  return {
    queryKey: criteria ? keyMap[criteria] : ["employees"],
    queryFn: async () => {
      const response = await privateFetch(
        `/employees?pageSize=999&populate=stores&sort=updatedAt&order=DESC${criteria === "non-erp-users" ? "&populate=user&filter[user][$null]" : ""}`,
      );

      const data = await response.json();
      const employees = employeesSchema.parse(data);

      const filteredEmployees =
        criteria === "employees-with-no-store"
          ? employees.data.filter((e) =>
              e.stores ? e.stores.length === 0 : false,
            )
          : employees.data;

      return filteredEmployees;
    },
  };
};

export async function loader() {
  return await queryClient.ensureQueryData(genEmployeesQuery());
}
