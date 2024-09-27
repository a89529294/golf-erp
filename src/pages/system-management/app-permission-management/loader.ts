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
  store: {
    name: string;
    id: string;
  } | null;
  employeeId: string;
};

const featureOrder: Record<string, number> = {
  "模擬器 / 基本操作": 0,
  "模擬器 / 報表": 1,
  "模擬器 / 贈送點數": 2,
  "高爾夫球 / 基本操作": 3,
  // "高爾夫球 / 報表": 4,
  "高爾夫球 / 贈送點數": 5,
  "練習場 / 基本操作": 6,
  "練習場 / 報表": 7,
  "練習場 / 贈送點數": 8,
  廠商管理: 9,
  系統管理: 10,
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
      }))
      .filter((user) => user.employee);

    const erpFeatures = erpFeaturesResponseSchema
      .parse(await responses[1].json())
      .map((v) => ({
        name: v.name,
        id: v.id,
      }))
      .filter((v) => v.name !== "高爾夫球-報表");

    const erpFeaturesWithUsers: {
      featureId: string;
      featureName: string;
      users: AppPermissionUser[];
      order: number;
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

      const x = formattedFeature.split("/")[0].trim();

      erpFeaturesWithUsers.push({
        featureId: feature.id,
        featureName: formattedFeature,
        users: filteredUsers.map((user) => {
          let stores = user.employee?.stores ?? [];
          if (x === "模擬器") {
            stores = stores.filter((s) => s.category === "simulator");
          } else if (x === "高爾夫") {
            stores = stores.filter((s) => s.category === "golf");
          } else if (x === "練習場") {
            stores = stores.filter((s) => s.category === "ground");
          }

          return {
            id: user.id,
            idNumber: user.account,
            chName: user.username,
            telphone: user.employee?.telphone ?? "",
            storeCategory:
              storeCategoryMap[
                stores[0]?.category as keyof typeof storeCategoryMap
              ] ?? "",
            store: stores[0]
              ? {
                  name: stores[0].name,
                  id: stores[0].id,
                }
              : null,
            employeeId: user.employee?.id ?? "",
          };
        }),
        order: featureOrder[formattedFeature],
      });
    });

    const allUsers: AppPermissionUser[] = users.map((user) => ({
      id: user.id,
      idNumber: user.account,
      chName: user.username,
      telphone: user.employee?.telphone ?? "",
      storeCategory:
        storeCategoryMap[
          user.employee?.stores?.[0]?.category as keyof typeof storeCategoryMap
        ] ?? "",
      store: user.employee?.stores?.[0]
        ? {
            name: user.employee.stores[0].name,
            id: user.employee.stores[0].id,
          }
        : null,
      employeeId: user.employee?.id ?? "",
    }));

    return {
      erpFeaturesWithUsers: erpFeaturesWithUsers.sort(
        (a, b) => a.order - b.order,
      ),
      allUsers,
    };
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(erpFeaturesWithUsersQuery);
}
