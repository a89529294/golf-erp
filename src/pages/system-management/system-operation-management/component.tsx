import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";

import { columns } from "@/pages/system-management/system-operation-management/data-table/columns";
import { DataTable } from "@/pages/system-management/system-operation-management/data-table/data-table";
import {
  loader,
  usersQuery,
} from "@/pages/system-management/system-operation-management/loader";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { AddEmployeeAsERPUserModal } from "@/components/select-employees-modal/add-employee-as-erp-user-modal";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function Component() {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: users } = useQuery({
    ...usersQuery,
    initialData: initialData.users,
  });
  const { data: employees } = useQuery({
    ...genEmployeesQuery("non-erp-users"),
    initialData: initialData.employees,
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["delete-users"],
    mutationFn: async () => {
      const userIds = Object.keys(rowSelection);
      await Promise.all(
        users
          .filter((u) => userIds.includes(u.id))
          .map((user) =>
            privateFetch(`/employees/${user.employee.id}/erp-user`, {
              method: "DELETE",
            }),
          ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setRowSelection({});
      toast.success("移除員工系統權限");
    },
    onError: () => toast.error("刪除員工系統權限失敗"),
  });

  const headerRowHeight = 48;

  return (
    <MainLayout
      headerChildren={
        <>
          {Object.keys(rowSelection).length ? (
            <Modal
              dialogTriggerChildren={
                <IconWarningButton icon="trashCan">刪除</IconWarningButton>
              }
              onSubmit={mutateAsync}
              title="確定移除選取員工系統權限?"
            />
          ) : (
            <AddEmployeeAsERPUserModal
              dialogTriggerChildren={
                <IconButton icon="plus" className="sm:text-sm">
                  新增系統{!isMobile && "操作"}人員
                </IconButton>
              }
              employees={employees}
            />
          )}

          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {isMobile ? (
        ({ height }) => {
          return (
            <ScrollArea className="inset-0 sm:absolute">
              <DataTable
                columns={columns}
                data={users}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          );
        }
      ) : (
        <div className="w-full border border-t-0 border-line-gray bg-light-gray pt-0">
          <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
          <div
            className="sticky z-10 w-full border-b border-line-gray"
            style={{
              top: `calc(90px + ${headerRowHeight}px)`,
            }}
          />
          <DataTable
            columns={columns}
            data={users}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      )}
    </MainLayout>
  );
}
