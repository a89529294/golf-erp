import { ArrowUpDown } from "lucide-react";
import trashCanIcon from "@/assets/trash-can-icon.svg";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { ChargeDiscount } from "@/pages/driving-range/cashback-settings/loader.ts";
import { CashbackDetailModal } from "@/components/cashback-settings/cashback-detail-modal.tsx";
import pencil from "@/assets/pencil.svg";
import { Modal } from "@/components/modal.tsx";
import { cn } from "@/lib/utils.ts";

const columnHelper = createColumnHelper<ChargeDiscount>();

function ActionButtons({
  category,
  rowData,
  storeId,
  deleteChargeDiscount,
}: {
  category: "ground" | "golf" | "simulator";
  rowData: ChargeDiscount;
  storeId: string;
  deleteChargeDiscount: (id: string) => Promise<void>;
}) {
  return (
    <div className="flex justify-end gap-2 pr-6">
      <CashbackDetailModal
        dialogTriggerChildren={
          <button className="">
            <img alt="pencil" src={pencil} />
          </button>
        }
        category={category}
        mode="edit"
        chargeDiscount={rowData}
        storeId={storeId}
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
          onSubmit={() => deleteChargeDiscount(rowData.id)}
        />
      </div>
    </div>
  );
}

export function genColumns(
  category: "ground" | "golf" | "simulator",
  storeId: string,
  deleteChargeDiscount: (id: string) => Promise<void>,
) {
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
    columnHelper.accessor("chargeAmount", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            儲值金額
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: 40,
    }),

    columnHelper.accessor("extraAmount", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            贈送金額
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </button>
        );
      },
      cell: (props) => (
        <span className="whitespace-nowrap">{props.getValue()} </span>
      ),
      size: undefined,
    }),
    columnHelper.display({
      id: "edit-modal",
      cell: (props) => {
        return flexRender(ActionButtons, {
          category,
          storeId,
          rowData: props.row.original,
          deleteChargeDiscount,
        });
      },
      size: 10,
    }),
  ] as ColumnDef<ChargeDiscount>[];
}
