import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MemberAppChargeHistory } from "../loader";

const columnHelper = createColumnHelper<MemberAppChargeHistory>();

export const columns = [
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: () => <div className="sm:w-24">付款完成日期</div>,
  }),
  columnHelper.display({
    id: "payment-method",
    header: () => <div className="w-20">支付方式</div>,
    cell: "信用卡",
  }),
  columnHelper.accessor("amount", {
    id: "amount",
  }),
  columnHelper.display({
    id: "serial-number",

    header: () => <div className="whitespace-nowrap">商家訂單編號</div>,
    cell: "88327761",
  }),
  columnHelper.display({
    id: "payment-provider-serial-number",
    header: () => <div className="whitespace-nowrap">藍新金流交易序號</div>,
    cell: "2024042013248759175",
  }),
  columnHelper.display({
    id: "outcome",
    header: () => <div className="whitespace-nowrap">刷卡結果</div>,
    cell: "付款成功",
  }),
] as ColumnDef<MemberAppChargeHistory>[];
