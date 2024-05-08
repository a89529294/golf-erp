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

export function Component() {
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
        userIds.map((id) =>
          privateFetch(`/users/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRowSelection({});
      toast.success("移除員工系統權限");
    },
    onError: () => toast.error("刪除員工系統權限失敗"),
  });

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
          ) : null}
          <AddEmployeeAsERPUserModal
            dialogTriggerChildren={
              <IconButton icon="plus">新增系統操作人員</IconButton>
            }
            employees={employees}
          />
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={users}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </MainLayout>
  );
}
