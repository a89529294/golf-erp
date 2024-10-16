import { genColumns } from "@/components/equipment-management/data-table/columns";
import { DataTable } from "@/components/equipment-management/data-table/data-table.tsx";
import { EquipmentDetailModal } from "@/components/equipment-management/equipment-detail-modal.tsx";
import { SearchInput } from "@/components/search-input.tsx";
import { IconButton } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
// import useMediaQuery from "@/hooks/use-media-query.ts";
import { MainLayout } from "@/layouts/main-layout.tsx";
import { equipmentsQuery } from "@/pages/equipment-management/loader.ts";
import { privateFetch } from "@/utils/utils.ts";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { loader } from ".";

export function Component() {
  // const isMobile = useMediaQuery("(max-width: 639px)");
  // const headerRowHeight = 48;

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: equipments } = useQuery({
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
      <div className="absolute inset-0 mb-2.5 border border-t-0 border-line-gray">
        <ScrollArea className="h-full w-full">
          <DataTable
            columns={columns}
            data={[...equipments, ...equipments, ...equipments]}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Scrollbar orientation="horizontal" />
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
