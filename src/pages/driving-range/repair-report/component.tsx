import { GenericDataTable } from "@/components/generic-data-table";
import { SearchInput } from "@/components/search-input";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { columns } from "./columns";
import { useLoaderData } from "react-router-dom";
import { loader, groundRepairRequestsQuery } from "./loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/modal";
import { IconWarningButton } from "@/components/ui/button";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function Component() {
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...groundRepairRequestsQuery,
    initialData,
  });
  const { mutateAsync: deleteRepairReports } = useMutation({
    mutationKey: ["delete-repair-reports"],
    mutationFn: async () => {
      const promises = Object.keys(rowSelection).map((id) =>
        privateFetch(`/repair-request/${id}`, {
          method: "DELETE",
        }),
      );

      await Promise.all(promises);
    },
    onSuccess() {
      toast.success("刪除成功");
    },
    onError() {
      toast.error("至少一項刪除失敗");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["ground-repair-requests"],
      });
    },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  return (
    <MainLayout
      headerChildren={
        <>
          {Object.keys(rowSelection).length > 0 && (
            <Modal
              dialogTriggerChildren={
                <IconWarningButton icon="redX">刪除</IconWarningButton>
              }
              onSubmit={deleteRepairReports}
            >
              是否刪除選取的報修回報?
            </Modal>
          )}
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
        </>
      }
    >
      <GenericDataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </MainLayout>
  );
}
