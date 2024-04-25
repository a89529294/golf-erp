import { storeCategories } from "@/utils/types";
import { privateFetch, redirectToLoginIf401 } from "@/utils/utils";
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

export async function loader() {
  const response = await privateFetch(
    "/employees?pageSize=999&populate=stores",
  );

  redirectToLoginIf401(response.status);

  const data = await response.json();
  const employees = employeesSchema.parse(data);

  return employees.data;
}
