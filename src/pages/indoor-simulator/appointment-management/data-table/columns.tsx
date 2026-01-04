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
    accessorKey: "storeSimulatorName",
    header: ({ column }) => {
      return (
        <button className="flex items-center gap-1 whitespace-nowrap">
          包廂編號
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
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          名稱
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">
        {(prop.getValue() as string) ?? prop.row.original.order?.userName}
      </div>
    ),
  },
  {
    accessorKey: "appUser.phone",
    header: "電話",
    cell: (prop) => (
      <div className="whitespace-nowrap">
        {(prop.getValue() as string) ?? prop.row.original.order?.userPhone}
      </div>
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
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          修改時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (prop) => {
      const value = prop.getValue();

      if (!value) return <div className="whitespace-nowrap">-</div>;

      try {
        const dateStr = String(value).replace(/\.\d+Z$/, "Z");

        const date = new Date(dateStr);

        if (isNaN(date.getTime()))
          return <div className="whitespace-nowrap">-</div>;

        const d = subHours(date, 0);
        return (
          <div className="whitespace-nowrap">
            {format(d, "yyyy-MM-dd HH:mm")}
          </div>
        );
      } catch (e) {
        return <div className="whitespace-nowrap">-</div>;
      }
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
