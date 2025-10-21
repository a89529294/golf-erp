import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";
import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader";
import { getAllowedStores } from "@/utils";

export const appUserDiscountSchema = z.array(
  z.object({
    id: z.string(),
    appUserType: z.string(),
    discount: z.string(),
  }),
);

export const appUserDiscountQuery = (storeId: string) => ({
  queryKey: ["appUser", "discount", storeId],
  queryFn: async () => {
    const response = await privateFetch(
      `/app-users/app-user-discount/store/${storeId}`,
    );
    const data = await response.json();

    return appUserDiscountSchema.parse(data);
  },
});

export async function loader() {
  // Load store data for StoreSelect component
  const storeData = await queryClient.ensureQueryData(
    getStoresQuery(
      await getAllowedStores("simulator"),
      "simulator",
      JSON.parse(localStorage.getItem("golf-erp-user")!).account,
    ),
  );

  // Return empty discount data initially - will be loaded based on selected store
  return { discountData: [], storeData };
}
