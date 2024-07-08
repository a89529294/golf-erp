import { GenericDataTable } from "@/components/generic-data-table";
import { CircularProgressWithDesc } from "@/pages/indoor-simulator/report/components/circular-progress-with-desc";
import { columns } from "./site-section-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { Appointment } from "@/types-and-schemas/appointment";

export function SiteSection({
  title,
  appointments,
}: {
  title: string;
  appointments: Appointment[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="col-span-2 rounded-md bg-white px-5 py-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mb-4 mt-2.5 flex gap-4">
        <CircularProgressWithDesc
          filledPercentage={35}
          amount={100000}
          label="總營業額"
        />
        <CircularProgressWithDesc
          filledPercentage={67}
          amount={100000}
          label="6月營業額"
        />
        <CircularProgressWithDesc
          filledPercentage={35}
          amount={1000}
          label="總訂單數"
          type="secondary"
        />
        <CircularProgressWithDesc
          filledPercentage={99}
          amount={100}
          label="6月 訂單數"
          type="secondary"
        />

        <TextButton className="ml-auto self-end" onClick={() => setOpen(!open)}>
          展開訂單
        </TextButton>
      </ul>

      <ScrollArea className={open ? "max-h-[390px]" : "max-h-0"}>
        <GenericDataTable
          columns={columns}
          data={appointments.map((v) => ({
            id: v.id,
            name: v.appUser.chName,
            phone: v.appUser.phone,
            startDateTime: v.startTime,
            endDateTime: v.endTime,
            amount: v.amount,
          }))}
        />
      </ScrollArea>
    </section>
  );
}
