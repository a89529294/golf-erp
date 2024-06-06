import { countyQuery } from "@/api/county-district";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { queryClient } from "@/utils/query-client";

export async function loader() {
  return await Promise.all([
    queryClient.ensureQueryData(countyQuery),
    queryClient.ensureQueryData(genEmployeesQuery()),
  ]);
}
