import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type Order = {
  id: string;
  name?: string;
  phone?: string;
  startDateTime: string;
  endDateTime: string;
  amount: number;
};

const columnHelper = createColumnHelper<Order>();

export const columns = [
  columnHelper.accessor("id", {
    header: "訂單編號",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("name", {
    header: "名稱",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),

  columnHelper.accessor("phone", {
    header: "電話",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("startDateTime", {
    header: "開始時間",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("endDateTime", {
    header: "結束時間",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("amount", {
    header: "訂單金額",
    cell: (prop) => (
      <div className="whitespace-nowrap font-bold text-secondary-purple">
        {prop.getValue()}
      </div>
    ),
  }),
] as ColumnDef<Order>[];
