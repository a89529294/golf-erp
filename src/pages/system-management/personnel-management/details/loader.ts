import { storesQuery } from "@/pages/store-management/loader";
import { employeeSchema } from "@/pages/system-management/personnel-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";

export const genEmployeeQuery = (id: string) => ({
  queryKey: ["employee", id],
  queryFn: async () => {
    const response = await privateFetch(`/employees/${id}`);
    const employee = employeeSchema.parse(await response.json());
    return employee;
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;
  const promises = [
    queryClient.ensureQueryData(genEmployeeQuery(id)),
    queryClient.ensureQueryData(storesQuery),
  ] as const;

  return Promise.all(promises);
}
