import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type Order = {
  id: string;
  name?: string;
  phone?: string;
  createdAt: string;
  paymentType: string;
  amount: number;
  merchantId?: string;
};

const columnHelper = createColumnHelper<Order>();

export const columns = [
  columnHelper.accessor("createdAt", {
    header: "時間",
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
] as ColumnDef<Order>[];
