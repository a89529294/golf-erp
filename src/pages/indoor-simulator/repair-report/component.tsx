import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { RepairDesktopMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-desktop-menubar";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { columns } from "./columns";
import { loader, simulatorRepairRequestsQuery } from "./loader";
import { RepairMobileMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-mobile-menubar";

export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...simulatorRepairRequestsQuery,
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
        queryKey: ["simulator-repair-requests"],
      });
    },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  async function onDeleteRepairReports() {
    await deleteRepairReports();
    setRowSelection({});
  }

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <RepairMobileMenubar
            onDeleteRepairReports={onDeleteRepairReports}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
          />
        ) : (
          <RepairDesktopMenubar
            onDeleteRepairReports={onDeleteRepairReports}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
          />
        )
      }
    >
      {isMobile ? (
        ({ height }) => {
          return (
            <ScrollArea style={{ height }}>
              <GenericDataTable
                columns={columns}
                data={data}
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
        <GenericDataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
    </MainLayout>
  );
}
