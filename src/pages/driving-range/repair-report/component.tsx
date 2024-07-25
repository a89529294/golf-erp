import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { RepairDesktopMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-desktop-menubar";
import { RepairMobileMenubar } from "@/pages/indoor-simulator/repair-report/components/repair-mobile-menubar";
import { groundRepairRequestsSchema } from "@/types-and-schemas/repair-request";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "query-string";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { columns } from "./columns";
import { loader } from "./loader";
export function Component() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data, isLoading } = useQuery({
    queryKey: ["repair-requests", storeId],
    queryFn: async () => {
      const queryString = qs.stringify({
        pageSize: 99,
        sort: "createdAt",
        order: "DESC",
        populate: "storeGround.store",
        "filter[storeGround][$notNull]": "",
        "filter[storeGround.store.id]": storeId,
      });
      const response = await privateFetch(`/repair-request?${queryString}`);
      const data = await response.json();

      const parsed = groundRepairRequestsSchema.parse(data).data;

      return parsed;
    },
    enabled: !!storeId,
  });
  const { mutateAsync: onDeleteRepairReports } = useMutation({
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
        queryKey: ["repair-requests"],
      });
    },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

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
            category="ground"
          />
        ) : (
          <RepairDesktopMenubar
            initialData={initialData}
            onDeleteRepairReports={onDeleteRepairReports}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            category="ground"
          />
        )
      }
    >
      {isLoading ? (
        <div className="grid h-full w-full place-items-center">
          <Spinner />
        </div>
      ) : data ? (
        isMobile ? (
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
        )
      ) : null}
    </MainLayout>
  );
}
