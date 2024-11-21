import { EditCouponModal } from "@/components/coupon-management/edit-coupon-modal";
import { StoreSendToAllCouponModal } from "@/components/coupon-management/store-send-to-all-coupon-modal";
import { Tablet } from "@/components/tablet";
import { Coupon } from "@/pages/driving-range/coupon-management/loader";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<Coupon>();

export function genColumns(
  category: "ground" | "golf" | "simulator",
  storeName: string,
  storeId: string,
) {
  return [
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
        <span className="whitespace-nowrap">{props.getValue() + " 天"} </span>
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
      cell: (props) => (
        <div className="text-line-green">
          {props.getValue()}
          <span className="ml-1 text-secondary-dark">元</span>
        </div>
      ),
      size: undefined,
    }),
    columnHelper.display({
      id: "send-coupon-modal",
      cell: (props) => {
        return (
          <StoreSendToAllCouponModal
            storeName={storeName}
            couponName={props.row.original.name}
          />
        );
      },
      size: 5,
    }),
    columnHelper.display({
      id: "edit-modal",
      // cell: (props) => {
      //   return flexRender(EditCouponModal, {
      //     category,
      //     id: props.row.original.id,
      //     name: props.row.original.name,
      //     expiration: props.row.original.expiration,
      //     amount: props.row.original.amount,
      //     number: props.row.original.number,
      //     isActive: props.row.original.isActive,
      //   });
      // },
      cell: (props) => {
        const originalRow = props.row.original;
        return (
          <EditCouponModal
            category={category}
            id={originalRow.id}
            name={originalRow.name}
            expiration={originalRow.expiration}
            amount={originalRow.amount}
            number={originalRow.number}
            isActive={originalRow.isActive}
          />
        );
      },
      size: 5,
    }),
  ] as ColumnDef<Coupon>[];
}
