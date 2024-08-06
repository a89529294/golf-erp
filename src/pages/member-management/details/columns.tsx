import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MemberAppChargeHistory, MemberSpendingHistory } from "../loader";
import { ArrowUpDown } from "lucide-react";

const topUpHistoryColumnHelper = createColumnHelper<MemberAppChargeHistory>();
const spendingHistoryColumnHelper = createColumnHelper<MemberSpendingHistory>();

export const topUpHistorycolumns = [
  topUpHistoryColumnHelper.accessor("store.name", {
    id: "store.name",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        廠商
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
  }),
  topUpHistoryColumnHelper.accessor("createdAt", {
    id: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        付款完成日期
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
  }),
  topUpHistoryColumnHelper.display({
    id: "payment-method",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-20"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        支付方式
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    cell: "信用卡",
  }),
  topUpHistoryColumnHelper.accessor("amount", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        金額
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    id: "amount",
  }),
  // topUpHistoryColumnHelper.display({
  //   id: "serial-number",
  //   header: ({column}) => <div className="whitespace-nowrap">商家訂單編號</div>,
  //   cell: "88327761",
  // }),
  // topUpHistoryColumnHelper.display({
  //   id: "payment-provider-serial-number",
  //   header: () => <div className="whitespace-nowrap">藍新金流交易序號</div>,
  //   cell: "2024042013248759175",
  // }),
  // topUpHistoryColumnHelper.display({
  //   id: "outcome",
  //   header: () => <div className="whitespace-nowrap">刷卡結果</div>,
  //   cell: "付款成功",
  // }),
] as ColumnDef<MemberAppChargeHistory>[];

export const spendingHistoryColumns = [
  spendingHistoryColumnHelper.accessor("storeSimulator.store.name", {
    id: "storeSimulator.store.name",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        包廂
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
  }),
  spendingHistoryColumnHelper.accessor("startTime", {
    id: "startTime",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        開始時間
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
  }),
  spendingHistoryColumnHelper.accessor("endTime", {
    id: "endTime",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        結束時間
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
  }),
  spendingHistoryColumnHelper.display({
    id: "payment-method",
    header: () => <div className="w-20">支付方式</div>,
    cell: "信用卡",
  }),
  spendingHistoryColumnHelper.accessor("amount", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        金額
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    id: "amount",
  }),
  spendingHistoryColumnHelper.accessor("status", {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        狀態
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    id: "status",
  }),
] as ColumnDef<MemberSpendingHistory>[];
