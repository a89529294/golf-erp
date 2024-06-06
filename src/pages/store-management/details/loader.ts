import { countyQuery } from "@/api/county-district";
import { storeSchema } from "@/pages/store-management/loader";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { linksKV } from "@/utils/links";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs, redirect } from "react-router";

export const genStoreQuery = (storeId: string) => ({
  queryKey: ["stores", storeId],
  queryFn: async () => {
    const response = await privateFetch(`/store/${storeId}?populate=employees`);
    const data = await response.json();
    return storeSchema.parse(data);
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  const storeId = params.storeId;

  if (!storeId) return redirect(linksKV["store-management"].paths.index);

  return await Promise.all([
    queryClient.ensureQueryData(countyQuery),
    queryClient.ensureQueryData(genEmployeesQuery()),
    queryClient.ensureQueryData(genStoreQuery(storeId)),
  ]);
}
