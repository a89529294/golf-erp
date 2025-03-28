import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { RepairDesktopMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-desktop-menubar";
import { RepairMobileMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-mobile-menubar";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { columns } from "./columns";
import { loader } from "./loader";
import qs from "query-string";
import { simulatorRepairRequestsSchema } from "@/types-and-schemas/repair-request";
import { Spinner } from "@/components/ui/spinner";

export function Component() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data, isLoading } = useQuery({
    queryKey: ["repair-requests", storeId],
    queryFn: async () => {
      const queryString = qs.stringify({
        pageSize: 99,
        sort: "createdAt",
        order: "DESC",
        populate: "storeSimulator.store",
        "filter[storeSimulator][$notNull]": "",
        "filter[storeSimulator.store.id]": storeId,
      });
      const response = await privateFetch(
        `/repair-request/simulator?${queryString}`,
      );
      const data = await response.json();

      const parsed = simulatorRepairRequestsSchema.parse(data).data;

      return parsed;
    },
    enabled: !!storeId,
  });
  const { mutateAsync: deleteRepairReports } = useMutation({
    mutationKey: ["delete-repair-reports"],
    mutationFn: async () => {
      const promises = Object.keys(rowSelection).map((id) =>
        privateFetch(`/repair-request/simulator/${id}`, {
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
        queryKey: ["repair-requests"],
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
            initialData={initialData}
            onDeleteRepairReports={onDeleteRepairReports}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            category="simulator"
          />
        ) : (
          <RepairDesktopMenubar
            initialData={initialData}
            onDeleteRepairReports={onDeleteRepairReports}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            category="simulator"
          />
        )
      }
    >
      {isLoading ? (
        <div className="grid h-full w-full place-items-center">
          <Spinner />
        </div>
      ) : data ? (
        <div className="relative flex-1 ">
          <div className="border-x- absolute inset-0 bottom-2.5 border border-t-0 border-line-gray">
            <ScrollArea className="h-full">
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
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}
