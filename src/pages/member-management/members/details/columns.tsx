import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  MemberAppChargeHistory,
  MemberAppUserCoupon,
  MemberSpendingHistory,
} from "../loader";
import { ArrowUpDown } from "lucide-react";
import { addDays, format } from "date-fns";
import { formatDateString } from "@/utils";

const topUpHistoryColumnHelper = createColumnHelper<MemberAppChargeHistory>();
const spendingHistoryColumnHelper = createColumnHelper<MemberSpendingHistory>();
const couponHistoryColumnHelper = createColumnHelper<MemberAppUserCoupon>();

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
    cell: (props) => {
      const ed = props.getValue()
        ? new Date(formatDateString(props.getValue()))
        : "";

      if (typeof ed === "string") return <div className="text-orange" />;

      ed.setHours(ed.getHours() + 8);
      const edFormatted = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(ed)
        .replace(",", "");
      return <div className="text-orange">{edFormatted}</div>;
    },
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
    cell: (props) => (
      <div className="text-line-green">
        {props.getValue()}
        <span className="ml-1 text-secondary-dark">元</span>
      </div>
    ),
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
    cell: (props) => {
      const sd = new Date(formatDateString(props.getValue()));

      sd.setHours(sd.getHours() - 8);

      const sdFormatted = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(sd)
        .replace(",", "");
      return <div className="text-orange">{sdFormatted}</div>;
    },
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
    cell: (props) => {
      const sd = new Date(formatDateString(props.getValue()));

      sd.setHours(sd.getHours() - 8);

      const sdFormatted = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(sd)
        .replace(",", "");
      return <div className="text-orange">{sdFormatted}</div>;
    },
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
    cell: (props) => (
      <div className="text-line-green">
        {props.getValue()}
        <span className="ml-1 text-secondary-dark">元</span>
      </div>
    ),
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

export const couponHistorycolumns = [
  couponHistoryColumnHelper.accessor("name", {
    id: "name",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        標題
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    size: 600,
  }),
  couponHistoryColumnHelper.accessor("expiration", {
    id: "expiration",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        使用期限
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    cell: (props) => <div>{props.getValue() + " 天"}</div>,
  }),
  couponHistoryColumnHelper.accessor("usedDate", {
    id: "usedDate",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-20"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        使用時間
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    cell: (props) => {
      console.log(props.row.original);
      return (
        <div className="text-orange">
          {format(
            addDays(
              new Date(props.row.original.createdAt),
              props.row.original.expiration,
            ),
            "yyyy-MM-dd",
          )}
        </div>
      );
    },
  }),
  couponHistoryColumnHelper.display({
    id: "status",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 sm:w-24"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        狀態
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </button>
    ),
    cell(props) {
      const orow = props.row.original;
      const createdAt = new Date(orow.createdAt);
      const expiration = orow.expiration;
      const useBefore = new Date(
        createdAt.setDate(createdAt.getDate() + expiration),
      );
      let status = "";

      if (orow.usedDate) status = "已使用";
      else if (new Date() > useBefore) status = "已過期";
      else status = "未使用";
      return <div>{status}</div>;
    },
  }),
  couponHistoryColumnHelper.accessor("amount", {
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
    cell: (props) => (
      <div className="text-line-green">
        {props.getValue()}
        <span className="ml-1 text-secondary-dark">元</span>
      </div>
    ),
  }),
] as ColumnDef<MemberAppUserCoupon>[];
