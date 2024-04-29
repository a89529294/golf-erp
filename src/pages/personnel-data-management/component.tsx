import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";
import { columns } from "@/pages/personnel-data-management/data-table/columns";
import { DataTable } from "@/pages/personnel-data-management/data-table/data-table";
import {
  employeesQuery,
  loader,
} from "@/pages/personnel-data-management/loader";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

export function Component() {
  const [rowSelection, setRowSelection] = useState({});
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...employeesQuery,
    initialData,
  });
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["delete-employees"],
    mutationFn: async () => {
      await privateFetch(`/employees/${Object.keys(rowSelection)[0]}`, {
        method: "DELETE",
      });
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
            >
              確定刪除選取員工?
            </Modal>
          ) : null}
          <IconButton icon="plus">
            <Link
              to={
                linksKV["data-management"].subLinks["personnel-data-management"]
                  .paths.new
              }
            >
              新增人員
            </Link>
          </IconButton>
          <SearchInput />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </MainLayout>
  );
}
