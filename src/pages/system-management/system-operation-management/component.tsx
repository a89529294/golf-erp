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

export function Component() {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: users } = useQuery({
    ...usersQuery,
    initialData: initialData.users,
  });
  const { data: employees } = useQuery({
    ...genEmployeesQuery(true),
    initialData: initialData.employees,
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["delete-employees"],
    mutationFn: async () => {
      const employeeIds = Object.keys(rowSelection);
      await Promise.all(
        employeeIds.map((id) =>
          privateFetch(`/employees/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setRowSelection({});
    },
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
              title="確定刪除選取員工?"
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
