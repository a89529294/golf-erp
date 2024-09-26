import fileIcon from "@/assets/black-file-icon.svg";
import { Tablet } from "@/components/tablet";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { SimpleMember, genderEnChMap, memberTypeEnChMap } from "../loader";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<SimpleMember>();

export const columns = [
  columnHelper.accessor((row) => (row.isActive ? "恢復" : "停權"), {
    id: "isActive",
    header: "",
    cell: (props) => {
      return (
        <div className="flex justify-center">
          <Tablet
            active={props.cell.row.original.isActive}
            value={props.getValue()}
          />
        </div>
      );
    },
    size: 7.2,
  }),
  // columnHelper.display({
  //   id: "send_points",
  //   header: "",
  //   cell: () => {
  //     return (
  //       <Modal dialogTriggerChildren={<TabletSendPoints />} onSubmit={() => {}}>
  //         <div>
  //           <h1 className="mb-1 text-center">數入點數</h1>
  //           <input className="text-center" type="number" />
  //         </div>
  //       </Modal>
  //     );
  //   },
  //   size: 11.2,
  // }),
  columnHelper.accessor("account", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          帳號
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: 10.5,
  }),
  columnHelper.accessor((row) => memberTypeEnChMap[row.appUserType], {
    id: "appUserType",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          會員類別
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    size: 10.5,
  }),
  columnHelper.accessor("chName", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          姓名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
    size: 13,
  }),
  columnHelper.accessor("phone", {
    id: "phone",
    header: () => <div>電話</div>,
    cell: (props) => props.getValue() as string,
    size: 11.7,
  }),
  columnHelper.accessor((row) => genderEnChMap[row.gender], {
    id: "gender",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          性別
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    size: 8,
  }),
  columnHelper.accessor("birthday", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          生日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (props) => props.getValue(),
    size: 11.5,
  }),
  columnHelper.accessor(
    (row) =>
      new Intl.NumberFormat()
        .format(
          (row.storeAppUsers ?? []).reduce((acc, val) => acc + val.coin, 0),
        )
        .toString(),
    {
      id: "coin",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            累積儲值金額
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => {
        return (
          <div className="flex gap-1">
            $
            <div className="font-medium text-line-green">
              {props.getValue()}
            </div>
          </div>
        );
      },
      size: undefined,
    },
  ),
  columnHelper.display({
    id: "detail-link",
    cell: (props) => {
      return (
        <Link
          to={`/member-management/members/details/${props.row.original.id}`}
          className="hidden group-hover:block"
        >
          <img src={fileIcon} />
        </Link>
      );
    },
    size: 4,
  }),
] as ColumnDef<SimpleMember>[];

export const mobileColumns = [
  // columnHelper.display({
  //   id: "send_points",
  //   header: "",
  //   cell: () => {
  //     return (
  //       <Modal dialogTriggerChildren={<TabletSendPoints />} onSubmit={() => {}}>
  //         <div className="">
  //           <h1 className="mb-1 text-center">數入點數</h1>
  //           <input className="text-center" type="number" />
  //         </div>
  //       </Modal>
  //     );
  //   },
  //   size: 40,
  // }),
  columnHelper.accessor("account", {
    header: "帳號",
    cell: (props) => props.getValue(),
    size: 20,
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
    size: 30,
  }),
  columnHelper.display({
    id: "detail-link",
    cell: (props) => {
      return (
        <Link
          to={`/member-management/members/details/${props.row.original.id}`}
          className="flex justify-center"
        >
          <img src={fileIcon} className="" />
        </Link>
      );
    },
    size: 10,
  }),
] as ColumnDef<SimpleMember>[];
