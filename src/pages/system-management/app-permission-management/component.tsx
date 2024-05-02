import {
  IconShortButton,
  IconShortWarningButton,
} from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import {
  AppPermissionUser,
  erpFeaturesWithUsersQuery,
} from "@/pages/system-management/app-permission-management/loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect, useRef, useState } from "react";
import { useActionData } from "react-router-dom";
import { loader } from "./loader";
import { AddPermissionModal } from "@/pages/system-management/app-permission-management/add-permission-modal/modal";
import { cn } from "@/lib/utils";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function Component() {
  const initialData = useActionData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...erpFeaturesWithUsersQuery,
    initialData,
  });
  // const allUsersWithoutCurrentPermission = (currentPermission:sting)=>data['all-users']

  const ref = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const cb = () =>
      setContainerHeight(ref.current?.getBoundingClientRect().height ?? 0);
    cb();

    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);

  return (
    <MainLayout>
      <div className=" w-full self-stretch" ref={ref}>
        <ScrollArea
          style={{ height: `${containerHeight - 10}px` }}
          className="mb-2.5 border border-line-gray bg-light-gray px-5 py-12"
        >
          {containerHeight ? (
            <div className="flex flex-col gap-5">
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
  const [allSelected, setAllSelected] = useState(false);
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
      toast.success("成功刪除權限");
    },
  });

  return (
    <section>
      <header className="flex items-center gap-1.5">
        <label className="px-6 py-5">
          <input
            type="checkbox"
            className="peer hidden"
            checked={allSelected}
            onChange={(e) => {
              setAllSelected(e.target.checked);

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

                      if (users.length === rowSelection.size + 1)
                        setAllSelected(true);
                    } else {
                      setRowSelection((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(user.employeeId);
                        return newSet;
                      });
                      setAllSelected(false);
                    }
                  }}
                />
                <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:border-secondary-dark peer-checked:before:block" />
              </label>
              <div className="mr-14 w-28">{user.idNumber}</div>
              <div className="mr-20 w-28">{user.chName}</div>
              <div className="mr-14 w-28">{user.telphone}</div>
              <div className="mr-20 w-28">{user.storeCategory}</div>
              <div>{user.store}</div>
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
