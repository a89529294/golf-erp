import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ImagesContainer } from "@/components/repair-images-container";
import {
  RepairStatus,
  SimulatorRepairRequest,
} from "@/types-and-schemas/repair-request";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { queryClient } from "@/utils/query-client";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<SimulatorRepairRequest>();

async function patchStatus(requestId: string, status: RepairStatus) {
  try {
    await privateFetch(`/repair-request/simulator/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("更新狀態成功");
    queryClient.invalidateQueries({ queryKey: ["repair-requests"] });
  } catch (e) {
    console.log(e);
    toast.error("更新狀態失敗");
  }
}

export const columns = [
  columnHelper.display({
    id: "checkbox",
    header: ({ table }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          狀態
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="space-y-4 text-sm text-word-darker-gray">
        {prop.getValue() === "pending" && (
          <div
            className={cn(
              "w-20 rounded-full border border-word-darker-gray text-center",
              prop.getValue() === "pending" &&
                "border-orange bg-orange text-white",
            )}
          >
            進行中
          </div>
        )}

        {prop.getValue() === "complete" && (
          <div
            className={cn(
              "w-20 rounded-full border border-word-darker-gray text-center",
              prop.getValue() === "complete" &&
                "border-line-green bg-line-green text-white",
            )}
          >
            已完成
          </div>
        )}

        {prop.getValue() === "no-problem" && (
          <div
            className={cn(
              "w-20 rounded-full border border-word-darker-gray text-center",
              prop.getValue() === "no-problem" &&
                "border-word-darker-gray bg-word-darker-gray text-white",
            )}
          >
            無須處理
          </div>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("storeSimulator.store.name", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          廠商
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),

  columnHelper.accessor("storeSimulator.name", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          場地
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          維修內容
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("images", {
    header: "圖片",
    cell: (prop) =>
      flexRender(ImagesContainer, {
        imageIds: prop.getValue(),
      }),
  }),
  columnHelper.display({
    id: "status-toggle",
    header: "修改狀態",
    cell: (prop) => {
      const currentStatus = prop.row.original.status;
      const requestId = prop.row.original.id;
      return (
        <div className="flex gap-4 text-sm text-word-darker-gray">
          <button
            className={cn(
              "w-20 rounded-full border  border-orange bg-orange text-center text-white disabled:cursor-not-allowed",
              currentStatus === "pending" &&
                "border-word-darker-gray bg-transparent text-word-darker-gray ",
            )}
            disabled={currentStatus === "pending"}
            onClick={() => patchStatus(requestId, "pending")}
          >
            進行中
          </button>
          <button
            className={cn(
              "w-20 rounded-full border border-line-green bg-line-green text-center text-white",
              currentStatus === "complete" &&
                "border-word-darker-gray bg-transparent text-word-darker-gray ",
            )}
            disabled={currentStatus === "complete"}
            onClick={() => patchStatus(requestId, "complete")}
          >
            已完成
          </button>
          <button
            className={cn(
              "w-20 rounded-full border bg-word-darker-gray  text-center text-white",
              currentStatus === "no-problem" &&
                "border-word-darker-gray bg-transparent text-word-darker-gray",
            )}
            disabled={currentStatus === "no-problem"}
            onClick={() => patchStatus(requestId, "no-problem")}
          >
            無須處理
          </button>
        </div>
      );
    },
  }),
] as ColumnDef<SimulatorRepairRequest>[];
