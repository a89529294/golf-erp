import { Tablet } from "@/components/tablet";
import { EditCouponModal } from "@/components/coupon-management/edit-coupon-modal";
import { Coupon } from "@/pages/driving-range/coupon-management/loader";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<Coupon>();

export const columns = [
  columnHelper.accessor((row) => (row.isActive ? "有效" : "無效"), {
    id: "isActive",
    header: "",
    cell: (props) => {
      return (
        <div className="flex justify-center">
          <Tablet
            active={props.cell.row.original.isActive}
            value={props.getValue()}
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
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          編號
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: 40,
  }),

  columnHelper.accessor("expiration", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          使用期限
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: undefined,
  }),
  columnHelper.display({
    id: "edit-modal",
    cell: (props) => {
      return flexRender(EditCouponModal, {
        id: props.row.original.id,
        name: props.row.original.name,
        expiration: props.row.original.expiration,
        amount: props.row.original.amount,
        number: props.row.original.number,
        isActive: props.row.original.isActive,
      });
    },
    size: undefined,
  }),
] as ColumnDef<Coupon>[];
