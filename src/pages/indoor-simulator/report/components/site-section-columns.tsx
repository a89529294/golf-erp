import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type AppointmentOrder = {
  id: string;
  name?: string;
  phone?: string;
  createdAt: string;
  startDateTime: string;
  endDateTime: string;
  paymentType: string;
  amount: number;
  merchantId?: string;
};

const columnHelper = createColumnHelper<AppointmentOrder>();

export const columns = [
  columnHelper.accessor("createdAt", {
    header: "建立時間",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  ,
  columnHelper.accessor("startDateTime", {
    header: "開始時間",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("endDateTime", {
    header: "結束時間",
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
  columnHelper.accessor("merchantId", {
    header: "merchantId",
    cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("paymentType", {
    header: "付款方式",
    cell: (prop) => <div className="whitespace-nowrap ">{prop.getValue()}</div>,
  }),
  columnHelper.accessor("amount", {
    header: "訂單金額",
    cell: (prop) => (
      <div className="whitespace-nowrap font-bold text-secondary-purple">
        {prop.getValue()}
      </div>
    ),
  }),
] as ColumnDef<AppointmentOrder>[];
