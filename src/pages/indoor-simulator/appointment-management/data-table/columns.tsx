import { Modal } from "@/components/modal";
import { IconShortButton } from "@/components/ui/button";
import { Appointment } from "@/pages/indoor-simulator/appointment-management/loader";
import { privateFetch } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: "訂單編號",
  },
  {
    accessorKey: "appUser.chName",
    header: "名稱",
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
    header: "開始時間",
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "endTime",
    header: "結束時間",
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "狀態",
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
