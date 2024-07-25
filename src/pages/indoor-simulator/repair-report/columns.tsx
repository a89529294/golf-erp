import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ImagesContainer } from "@/components/repair-images-container";
import { SimulatorRepairRequest } from "@/types-and-schemas/repair-request";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<SimulatorRepairRequest>();

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
    header: "狀態",
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
    header: "廠商",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),

  columnHelper.accessor("storeSimulator.name", {
    header: "場地",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("description", {
    header: "維修內容",
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
    cell: (prop) => (
      <div className="flex gap-4 text-sm text-word-darker-gray">
        <div
          className={cn(
            "w-20 rounded-full border border-word-darker-gray text-center",
            prop.getValue() === "pending" &&
              "border-orange bg-orange text-white",
          )}
        >
          進行中
        </div>
        <div
          className={cn(
            "w-20 rounded-full border border-word-darker-gray text-center",
            prop.getValue() === "complete" &&
              "border-line-green bg-line-green text-white",
          )}
        >
          已完成
        </div>
        <div
          className={cn(
            "w-20 rounded-full border border-word-darker-gray text-center",
            prop.getValue() === "no-problem" &&
              "border-word-darker-gray bg-word-darker-gray text-white",
          )}
        >
          無須處理
        </div>
      </div>
    ),
  }),
] as ColumnDef<SimulatorRepairRequest>[];
