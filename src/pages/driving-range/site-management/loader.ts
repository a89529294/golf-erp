import {
  storesWithSitesSchema,
  storesWithoutEmployeesSchema,
} from "@/pages/store-management/loader";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const genGroundStoresWithSitesQuery = (
  allowedStores: string[] | "all",
) => {
  return {
    queryKey: ["sites-for-stores", "ground"],
    queryFn: async () => {
      let fetchString =
        "/store?pageSize=99&filter[category]=ground&populate=simulators&populate=grounds&populate=golfs&populate=grounds.openTimes&populate=grounds.equipment&populate=grounds.openDays";

      if (allowedStores !== "all") fetchString = "";

      const response = await privateFetch(fetchString);

      const data = storesWithSitesSchema.parse(await response.json()).data;

      return data;
    },
  };
};

export const groundStoresQuery = {
  queryKey: ["ground-stores"],
  queryFn: async () => {
    const response = await privateFetch(
      "/store?pageSize=99&filter[category]=ground",
    );

    const data = storesWithoutEmployeesSchema.parse(await response.json()).data;

    return data;
  },
};

export async function loader() {
  const permissionsResponse = await privateFetch("/auth/permissions");
  const permissions = await permissionsResponse.json();

  let allowedStores: string[] | "all";
  if (permissions.includes("system:admin")) allowedStores = "all";
  else {
    const authResponse = await privateFetch("auth/me?populate=*");
    const user = (await authResponse.json()) as {
      employee: {
        stores: { id: string; category: "ground" | "golf" | "simulator" }[];
      };
    };

    allowedStores = user.employee.stores
      .filter((s) => s.category === "ground")
      .map((s) => s.id);
  }

  return await queryClient.ensureQueryData(
    genGroundStoresWithSitesQuery(allowedStores),
  );
}
