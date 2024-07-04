import { GenericDataTable } from "@/components/generic-data-table";
import { CircularProgressWithDesc } from "@/pages/indoor-simulator/report/components/circular-progress-with-desc";
import { columns } from "./site-section-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";

export function SiteSection({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const [data] = React.useState(
    Array(Math.floor(Math.random() * 20))
      .fill("")
      .map((_, i) => ({
        id: crypto.randomUUID() + i,
        name: "王小明",
        phone: "093450193",
        startDateTime: "2024/06/13  18:30",
        endDateTime: "2024/06/13  18:30",
        amount: 1600,
      })),
  );

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
        <GenericDataTable columns={columns} data={data} />
      </ScrollArea>
    </section>
  );
}
