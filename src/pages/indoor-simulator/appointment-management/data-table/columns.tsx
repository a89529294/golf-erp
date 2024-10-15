import { Modal } from "@/components/modal";
import { IconShortButton } from "@/components/ui/button";
import { Appointment } from "@/types-and-schemas/appointment";
import { privateFetch } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format, subHours } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          訂單編號
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "appUser.chName",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          名稱
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "appUser.phone",
    header: "電話",
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          開始時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      const d = subHours(new Date(prop.getValue() as string), 8);
      return (
        <div className="whitespace-nowrap">{format(d, "yyyy-MM-dd HH:mm")}</div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          結束時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      const d = subHours(new Date(prop.getValue() as string), 8);
      return (
        <div className="whitespace-nowrap">{format(d, "yyyy-MM-dd HH:mm")}</div>
      );
    },
  },
  {
    accessorKey: "order.paymentMethod",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          付款方式
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      prop.getValue() && console.log(prop.getValue());
      return (
        <div className="whitespace-nowrap">{prop.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          狀態
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "originAmount",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          原訂單金額
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    id: "discountPercentage",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          折數
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      const row = prop.row.original;
      const originAmount =
        row.originAmount ?? row.amount + (row.usedCoupon?.[0]?.amount ?? 0);
      const percentOff = (
        ((originAmount - row.amount) / originAmount) *
        100
      ).toFixed(2);
      return <div className="whitespace-nowrap">{percentOff}</div>;
    },
  },
  {
    id: "usedCouponAmount",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          優惠券金額
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">
        {prop.row.original.usedCoupon?.[0]?.amount}
      </div>
    ),
  },
  {
    id: "usedCouponName",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          優惠券名稱
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      console.log(prop.row.original.usedCoupon);
      return (
        <div className="whitespace-nowrap">
          {prop.row.original.usedCoupon?.[0]?.name}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          實際付款金額
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      console.log(prop.row.original.usedCoupon);
      return (
        <div className="whitespace-nowrap">{prop.getValue() as string}</div>
      );
    },
  },
  {
    id: "cancel-appointment",
    cell: (prop) => {
      const appointment = prop.row.original;
      return (
        <Modal
          dialogTriggerChildren={
            <IconShortButton
              className="w-28 whitespace-nowrap group-hover:visible"
              icon="x"
            >
              取消預約
            </IconShortButton>
          }
          onSubmit={async () => {
            try {
              await privateFetch(
                `/appointment/simulator/cancel/${appointment.id}`,
                {
                  method: "POST",
                },
              );
              toast.success("成功取消預約");
            } catch (e) {
              console.log(e);
              toast.error("無法取消預約");
            }
          }}
        >
          確認取消預約?
        </Modal>
      );
    },
  },
];
