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

export function Component() {
  const initialData = useActionData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...erpFeaturesWithUsersQuery,
    initialData,
  });
  // const allUsersWithoutCurrentPermission = (currentPermission:sting)=>data['all-users']

  return (
    <MainLayout>
      {({ height }) => {
        return (
          <ScrollArea
            style={{ height: `${height - 10}px` }}
            className="mb-2.5 w-full border border-line-gray bg-light-gray px-5 py-12"
          >
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
            className="hidden peer"
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
                  className="hidden peer"
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
              <div className="sm:w-28">{user.store?.name}</div>
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
