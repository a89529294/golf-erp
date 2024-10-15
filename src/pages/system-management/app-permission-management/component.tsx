import {
  IconShortButton,
  IconShortWarningButton,
} from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { AddPermissionModal } from "@/pages/system-management/app-permission-management/add-permission-modal/modal";
import {
  AppPermissionUser,
  erpFeaturesWithUsersQuery,
} from "@/pages/system-management/app-permission-management/loader";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useActionData } from "react-router-dom";
import { toast } from "sonner";
import { loader } from "./loader";
import { motion } from "framer-motion";

export function Component() {
  const [category, setCategory] = useState("1");
  const initialData = useActionData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...erpFeaturesWithUsersQuery,
    initialData,
  });
  // const allUsersWithoutCurrentPermission = (currentPermission:sting)=>data['all-users']

  console.log(data.erpFeaturesWithUsers);

  const visibleFeatures = data.erpFeaturesWithUsers.filter((feature) => {
    if (category === "1") return true;
    if (category === "2") return feature.featureName.includes("模擬器");
    if (category === "3") return feature.featureName.includes("高爾夫");
    if (category === "4") return feature.featureName.includes("練習場");
  });

  return (
    <MainLayout>
      {({ height }) => {
        return (
          <ScrollArea
            style={{ height: `${height - 10}px` }}
            className="relative mb-2.5 w-full border border-line-gray bg-light-gray px-5 pb-4 pt-14"
          >
            <ul className="absolute left-2 top-2 isolate flex items-center gap-3 py-2 pl-3 sm:hidden">
              {[
                { id: "1", name: "全部" },
                { id: "2", name: "模擬器" },
                { id: "3", name: "高爾夫" },
                {
                  id: "4",
                  name: "練習場",
                },
              ].map(({ id, name }) => (
                <li key={id}>
                  <button
                    onClick={() => setCategory(id)}
                    className={cn(
                      "relative grid h-9 place-items-center rounded-full border border-line-gray bg-white px-5",
                    )}
                  >
                    {category === id && (
                      <motion.div
                        className="absolute inset-0 z-10 rounded-full bg-black"
                        layoutId="site-tab"
                        transition={{
                          duration: 0.3,
                        }}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-20 transition-colors duration-300",
                        category === id && "text-white",
                      )}
                    >
                      {name}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex h-full flex-col gap-5 ">
              {visibleFeatures.map((feature) => (
                <Section
                  key={feature.featureId}
                  title={feature.featureName}
                  users={feature.users}
                  allUsers={data.allUsers.filter(
                    (user) =>
                      !feature.users.find(
                        (erpUser) => erpUser.idNumber === user.idNumber,
                      ),
                  )}
                  featureId={feature.featureId}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        );
      }}
    </MainLayout>
  );
}

function Section({
  title,
  users,
  allUsers,
  featureId,
}: {
  title: string;
  users: AppPermissionUser[];
  allUsers: AppPermissionUser[];
  featureId: string;
}) {
  const [rowSelection, setRowSelection] = useState(new Set());
  const selectedEmployeeIds = Array.from(rowSelection);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["remove-users-permissions"],
    mutationFn: async () => {
      await privateFetch(`/erp-features/${featureId}/delete-permission`, {
        method: "DELETE",
        body: JSON.stringify({
          employeeIds: selectedEmployeeIds,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erp-features-with-users"] });
      toast.success("成功刪除管理權限");
      setRowSelection(new Set());
    },
    onError: () => toast.error("刪除管理權限失敗"),
  });

  return (
    <section>
      <header className="flex items-center gap-1.5">
        <label className="px-6 py-5">
          <input
            type="checkbox"
            className="peer hidden"
            checked={users.length === rowSelection.size && users.length > 0}
            onChange={(e) => {
              if (e.target.checked)
                setRowSelection(new Set(users.map((u) => u.employeeId)));
              else setRowSelection(new Set());
            }}
          />
          <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:border-secondary-dark peer-checked:before:block" />
        </label>
        <h2 className="font-semibold">{title}</h2>
        {selectedEmployeeIds.length ? (
          <IconShortWarningButton
            icon="minus"
            className="ml-auto"
            onClick={() => mutate()}
            disabled={isPending}
          >
            移除
          </IconShortWarningButton>
        ) : null}
        <AddPermissionModal
          dialogTriggerChildren={
            <IconShortButton
              className={cn(
                "mr-px",
                selectedEmployeeIds.length === 0 && "ml-auto",
              )}
              icon="plus"
              disabled={isPending}
            >
              新增人員
            </IconShortButton>
          }
          allUsers={allUsers}
          featureId={featureId}
        />
      </header>
      <ul className="bg-white">
        {users.length ? (
          users.map((user) => (
            <li
              key={user.idNumber}
              className="flex items-center border-b border-line-gray first-of-type:border-t"
            >
              <label className="block px-6 py-5">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={rowSelection.has(user.employeeId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRowSelection((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(user.employeeId);
                        return newSet;
                      });
                    } else {
                      setRowSelection((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(user.employeeId);
                        return newSet;
                      });
                    }
                  }}
                />
                <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:border-secondary-dark peer-checked:before:block" />
              </label>
              <div className="mr-14 w-28 sm:w-14 sm:shrink-0">
                {user.idNumber}
              </div>
              <div className="mr-20 w-28 sm:mr-5 sm:w-14 sm:shrink-0">
                {user.chName}
              </div>
              <div className="mr-14 w-28 sm:w-14 sm:shrink-0">
                {user.telphone}
              </div>
              <div className="mr-20 w-28 sm:mr-5 sm:w-20 sm:shrink-0">
                {user.storeCategory}
              </div>
              <div className="sm:w-auto sm:whitespace-nowrap">
                {user.store?.name}
              </div>
            </li>
          ))
        ) : (
          <li className="flex h-[54px] items-center justify-center border-b border-t border-line-gray text-word-gray">
            尚未新增人員
          </li>
        )}
      </ul>
    </section>
  );
}

{
  /* <MainLayout>
      <div className="self-stretch w-full" ref={ref}>
        <ScrollArea
          style={{ height: `${containerHeight - 10}px` }}
          className="mb-2.5 border border-line-gray bg-light-gray px-5 py-12"
        >
          {containerHeight ? (
            <div className="flex flex-col h-full gap-5">
              {data.erpFeaturesWithUsers.map((feature) => (
                <Section
                  key={feature.featureId}
                  title={feature.featureName}
                  users={feature.users}
                  allUsers={data.allUsers.filter(
                    (user) =>
                      !feature.users.find(
                        (erpUser) => erpUser.idNumber === user.idNumber,
                      ),
                  )}
                  featureId={feature.featureId}
                />
              ))}
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </MainLayout> */
}
