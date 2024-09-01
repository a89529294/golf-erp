import { loader } from ".";
import { useLoaderData } from "react-router-dom";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/main-layout.tsx";
import useMediaQuery from "@/hooks/use-media-query.ts";
import { SearchInput } from "@/components/search-input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { privateFetch } from "@/utils/utils.ts";
import { genColumns } from "@/components/equipment-management/data-table/columns";
import { IconButton } from "@/components/ui/button.tsx";
import { DataTable } from "@/components/equipment-management/data-table/data-table.tsx";
import { toast } from "sonner";
import { EquipmentDetailModal } from "@/components/equipment-management/equipment-detail-modal.tsx";
import { equipmentsQuery } from "@/pages/equipment-management/loader.ts";

export function Component() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const headerRowHeight = 48;

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: equipments, isLoading } = useQuery({
    ...equipmentsQuery,
    initialData,
  });

  const { mutateAsync: deleteEquipment } = useMutation({
    mutationKey: ["delete-equipment"],
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error("Equipment Id not found");
      }

      await privateFetch(`/equipment/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("刪除標籤成功");
      return queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });

  const columns = useMemo(() => genColumns(deleteEquipment), [deleteEquipment]);

  return (
    <MainLayout
      headerChildren={
        <>
          <EquipmentDetailModal
            dialogTriggerChildren={
              <IconButton icon="plus">新增標籤</IconButton>
            }
            mode="new"
          />
          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {isMobile ? (
        ({ height }) => (
          <ScrollArea style={{ height }} className="w-full">
            <div className="w-full border border-line-gray bg-light-gray p-1 pt-0">
              {equipments && (
                <DataTable
                  columns={columns}
                  data={equipments}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              )}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        )
      ) : (
        <div className={cn("w-full ", isLoading && "grid place-items-center")}>
          {isLoading ? (
            <Spinner />
          ) : equipments ? (
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
                data={equipments}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </div>
          ) : null}
        </div>
      )}
    </MainLayout>
  );
}
