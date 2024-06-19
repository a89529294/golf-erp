"use client";

import { IconShortButton } from "@/components/ui/button";
import { Appointment } from "@/pages/indoor-simulator/appointment-management/loader";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: "訂單編號",
  },
  {
    accessorKey: "user.name",
    header: "名稱",
  },
  {
    accessorKey: "user.phoneno",
    header: "電話",
  },
  {
    accessorKey: "startTime",
    header: "開始時間",
  },
  {
    accessorKey: "endTime",
    header: "結束時間",
  },
  {
    id: "cancel-appointment",
    cell: () => (
      <IconShortButton className="invisible group-hover:visible" icon="x">
        取消預約
      </IconShortButton>
    ),
  },
];
