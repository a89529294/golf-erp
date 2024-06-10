import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MemberAppChargeHistory } from "../loader";

const columnHelper = createColumnHelper<MemberAppChargeHistory>();

export const columns = [
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: "付款完成日期",
  }),
  columnHelper.display({
    id: "payment-method",
    header: "支付方式",
    cell: "信用卡",
  }),
  columnHelper.accessor("amount", {
    id: "amount",
    header: "訂單金額",
  }),
  columnHelper.display({
    id: "serial-number",
    header: "商家訂單編號",
    cell: "88327761",
  }),
  columnHelper.display({
    id: "payment-provider-serial-number",
    header: "藍新金流交易序號",
    cell: "2024042013248759175",
  }),
  columnHelper.display({
    id: "outcome",
    header: "刷卡結果",
    cell: "付款成功",
  }),
] as ColumnDef<MemberAppChargeHistory>[];
