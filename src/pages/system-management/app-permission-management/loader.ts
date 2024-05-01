import { usersWithRolesSchema } from "@/pages/system-management/system-operation-management/loader";
import { storeCategoryMap } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const erpFeaturesResponseSchema = z.array(
  z.object({
    name: z.string(),
    id: z.string(),
    employees: z.array(
      z.object({
        idNumber: z.string(),
        chName: z.string(),
        telphone: z.string(),
      }),
    ),
  }),
);

export type AppPermissionUser = {
  id: string;
  idNumber: string;
  chName: string;
  telphone: string;
  storeCategory: string;
  store: string;
  employeeId: string;
};

export const erpFeaturesWithUsersQuery = {
  queryKey: ["erp-features-with-users"],
  queryFn: async () => {
    const usersPromise = privateFetch(
      "/users?populate=roles&populate=employee&populate=employee.stores&pageSize=999",
    );
    const erpFeaturesPromise = privateFetch("/erp-features");

    const responses = await Promise.all([usersPromise, erpFeaturesPromise]);

    const users = usersWithRolesSchema
      .parse(await responses[0].json())
      .data.map((user) => ({
        ...user,
        roles: user.roles.map((r) => r.slice(8)),
      }));
    const erpFeatures = erpFeaturesResponseSchema
      .parse(await responses[1].json())
      .map((v) => ({
        name: v.name,
        id: v.id,
      }));

    const erpFeaturesWithUsers: {
      featureId: string;
      featureName: string;
      users: AppPermissionUser[];
    }[] = [];

    erpFeatures.forEach((feature) => {
      const filteredUsers = users.filter((user) =>
        user.roles.includes(feature.name),
      );

      let formattedFeature = feature.name;
      if (feature.name.includes("-")) {
        const strings = feature.name.split("-");
        formattedFeature = strings[0] + " / " + strings[1];
      }

      erpFeaturesWithUsers.push({
        featureId: feature.id,
        featureName: formattedFeature,
        users: filteredUsers.map((user) => ({
          id: user.id,
          idNumber: user.account,
          chName: user.username,
          telphone: user.employee?.telphone ?? "",
          storeCategory:
            storeCategoryMap[
              user.employee?.stores[0].category as keyof typeof storeCategoryMap
            ] ?? "",
          store: user.employee?.stores[0].name ?? "",
          employeeId: user.employee?.id ?? "",
        })),
      });
    });

    const allUsers: AppPermissionUser[] = users.map((user) => ({
      id: user.id,
      idNumber: user.account,
      chName: user.username,
      telphone: user.employee?.telphone ?? "",
      storeCategory:
        storeCategoryMap[
          user.employee?.stores[0].category as keyof typeof storeCategoryMap
        ] ?? "",
      store: user.employee?.stores[0].name ?? "",
      employeeId: user.employee?.id ?? "",
    }));

    return {
      erpFeaturesWithUsers,
      allUsers,
    };
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(erpFeaturesWithUsersQuery);
}
