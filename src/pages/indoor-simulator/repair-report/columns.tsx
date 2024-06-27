import { SimulatorRepairRequest } from "@/types-and-schemas/repair-request";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

const columnHelper = createColumnHelper<SimulatorRepairRequest>();

export const columns = [
  columnHelper.display({
    id: "checkbox",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
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
  columnHelper.accessor("status", {
    header: "狀態",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
] as ColumnDef<SimulatorRepairRequest>[];
