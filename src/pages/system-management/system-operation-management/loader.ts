import {
  employeeSchema,
  genEmployeesQuery,
} from "@/pages/system-management/personnel-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import queryString from "query-string";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  account: z.string(),
  username: z.string(),
  employee: employeeSchema.optional(),
});

const usersSchema = z.object({
  data: z.array(userSchema),
});

const userWithRolesSchema = userSchema.and(
  z.object({ roles: z.array(z.string()) }),
);

export const usersWithRolesSchema = z.object({
  data: z.array(userWithRolesSchema),
});

export type User = z.infer<typeof usersSchema>["data"][number];
export type UserWithEmployee = Required<User>;

export const usersQuery = {
  queryKey: ["users"],
  queryFn: async () => {
    const qs = queryString.stringify({
      pageSize: 999,
      populate: ["employee", "employee.stores"],
      sort: "updatedAt",
      order: "DESC",
    });
    const response = await privateFetch(`/users?${qs}`);

    const data = await response.json();
    const users = usersSchema.parse(data);

    return users.data.filter(
      (user): user is UserWithEmployee => user.employee !== undefined,
    );
  },
};

export async function loader() {
  const data = await Promise.all([
    queryClient.ensureQueryData(usersQuery),
    queryClient.ensureQueryData(genEmployeesQuery("non-erp-users")),
  ]);

  return {
    users: data[0],
    employees: [],
  };
}
