import { ArrowUpDown } from "lucide-react";
import trashCanIcon from "@/assets/trash-can-icon.svg";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import pencil from "@/assets/pencil.svg";
import { Modal } from "@/components/modal.tsx";
import { cn } from "@/lib/utils.ts";
import { EquipmentDetailModal } from "@/components/equipment-management/equipment-detail-modal.tsx";
import { Equipment } from "@/pages/equipment-management/loader.ts";

const columnHelper = createColumnHelper<Equipment>();

function ActionButtons({
  rowData,
  deleteEquipment,
}: {
  rowData: Equipment;
  deleteEquipment: (id: string) => Promise<void>;
}) {
  return (
    <div className="flex gap-2">
      <EquipmentDetailModal
        dialogTriggerChildren={
          <button className="">
            <img alt="pencil" src={pencil} />
          </button>
        }
        mode="edit"
        equipment={rowData}
        isInTableRow
      />
      <div className={cn("hidden text-right group-hover:block")}>
        <Modal
          dialogTriggerChildren={
            <button>
              <img src={trashCanIcon} />
            </button>
          }
          title={`確認刪除${rowData.title}?`}
          onSubmit={() => deleteEquipment(rowData.id)}
        />
      </div>
    </div>
  );
}

export function genColumns(deleteEquipment: (id: string) => Promise<void>) {
  return [
    columnHelper.accessor("title", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            標題
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: undefined,
    }),
    columnHelper.display({
      id: "edit-modal",
      cell: (props) => {
        return flexRender(ActionButtons, {
          rowData: props.row.original,
          deleteEquipment: deleteEquipment,
        });
      },
      size: 10,
    }),
  ] as ColumnDef<Equipment>[];
}
