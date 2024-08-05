import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MemberAppChargeHistory, MemberSpendingHistory } from "../loader";

const topUpHistoryColumnHelper = createColumnHelper<MemberAppChargeHistory>();
const spendingHistoryColumnHelper = createColumnHelper<MemberSpendingHistory>();

export const topUpHistorycolumns = [
  topUpHistoryColumnHelper.accessor("store.name", {
    id: "store.name",
    header: () => <div className="sm:w-24">廠商</div>,
  }),
  topUpHistoryColumnHelper.accessor("createdAt", {
    id: "createdAt",
    header: () => <div className="sm:w-24">付款完成日期</div>,
  }),
  topUpHistoryColumnHelper.display({
    id: "payment-method",
    header: () => <div className="w-20">支付方式</div>,
    cell: "信用卡",
  }),
  topUpHistoryColumnHelper.accessor("amount", {
    header: () => <div>金額</div>,
    id: "amount",
  }),
  topUpHistoryColumnHelper.display({
    id: "serial-number",
    header: () => <div className="whitespace-nowrap">商家訂單編號</div>,
    cell: "88327761",
  }),
  topUpHistoryColumnHelper.display({
    id: "payment-provider-serial-number",
    header: () => <div className="whitespace-nowrap">藍新金流交易序號</div>,
    cell: "2024042013248759175",
  }),
  topUpHistoryColumnHelper.display({
    id: "outcome",
    header: () => <div className="whitespace-nowrap">刷卡結果</div>,
    cell: "付款成功",
  }),
] as ColumnDef<MemberAppChargeHistory>[];

export const spendingHistoryColumns = [
  spendingHistoryColumnHelper.accessor("startTime", {
    id: "startTime",
    header: () => <div className="sm:w-24">開始時間</div>,
  }),
  spendingHistoryColumnHelper.accessor("endTime", {
    id: "endTime",
    header: () => <div className="sm:w-24">結束時間</div>,
  }),
  spendingHistoryColumnHelper.display({
    id: "payment-method",
    header: () => <div className="w-20">支付方式</div>,
    cell: "信用卡",
  }),
  spendingHistoryColumnHelper.accessor("amount", {
    header: () => <div>金額</div>,
    id: "amount",
  }),
  spendingHistoryColumnHelper.accessor("status", {
    header: () => <div>狀態</div>,
    id: "status",
  }),
] as ColumnDef<MemberSpendingHistory>[];
