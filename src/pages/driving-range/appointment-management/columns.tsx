import { Modal } from "@/components/modal";
import { IconShortButton } from "@/components/ui/button";
import { Appointment } from "@/types-and-schemas/appointment";
import { privateFetch } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
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
    header: () => <div className="whitespace-nowrap">電話</div>,
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          開始時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          結束時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
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
    id: "cancel-appointment",
    cell: (prop) => {
      const appointment = prop.row.original;
      return appointment.status === "取消" ? null : (
        <Modal
          dialogTriggerChildren={
            <IconShortButton
              className="invisible whitespace-nowrap group-hover:visible"
              icon="x"
            >
              取消預約
            </IconShortButton>
          }
          onSubmit={async () => {
            try {
              await privateFetch(
                `/appointment/ground/cancel/${appointment.id}`,
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
