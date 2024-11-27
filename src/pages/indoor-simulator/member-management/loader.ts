import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const getStoresQuery = (
  allowedStores: { id: string; name: string }[] | "all",
  category: "ground" | "golf" | "simulator",
  userAccount: string,
) => ({
  queryKey: ["stores", category, userAccount],
  queryFn: async () => {
    if (allowedStores === "all") {
      const response = await privateFetch(
        `/store?pageSize=999&filter[category]=${category}&populate=${category + "s"}`,
      );

      const data = await response.json();

      return data.data as { id: string; name: string }[];
      // const queryString = qs.stringify({
      //     pageSize: 999,
      //     sort: "updatedAt",
      //     order: "DESC",
      //     populate: ["store", "storeAppUsers"],
      //   });
      //   const response = await privateFetch(`/app-users?${queryString}`);

      //   const data = await response.json();

      //   return simpleMembersSchema.parse(data).data;
    } else {
      return allowedStores;
    }
  },
});

export async function loader() {
  return await queryClient.ensureQueryData(
    getStoresQuery(
      await getAllowedStores("simulator"),
      "simulator",
      JSON.parse(localStorage.getItem("golf-erp-user")!).account,
    ),
  );
}
