import { Tablet } from "@/components/tablet";
import { Checkbox } from "@/components/ui/checkbox";
import { Coupon } from "@/pages/driving-range/coupon-management/loader";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<Coupon>();

export const columns = [
  {
    id: "select",
    cell: ({ row }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!row.original.isActive}
        />
      </div>
    ),
    size: undefined,
  },
  columnHelper.accessor((row) => (row.isActive ? "有效" : "無效"), {
    id: "isActive",
    header: "",
    cell: (props) => {
      return (
        <div className="flex justify-center ">
          <Tablet
            active={props.cell.row.original.isActive}
            value={props.getValue()}
            activeCn="border-line-green text-line-green"
            inactiveCn="border-word-gray-dark text-word-gray-dark"
          />
        </div>
      );
    },
    size: undefined,
  }),
  columnHelper.accessor("number", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          編號
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: undefined,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          標題
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: 30,
  }),

  columnHelper.accessor("expiration", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          使用期限
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </button>
      );
    },
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
    size: undefined,
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          金額
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: undefined,
  }),
] as ColumnDef<Coupon>[];
