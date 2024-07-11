import fileIcon from "@/assets/black-file-icon.svg";
import { Tablet } from "@/components/tablet";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { SimpleMember, genderEnChMap, memberTypeEnChMap } from "../loader";

const columnHelper = createColumnHelper<SimpleMember>();

export const columns = [
  columnHelper.accessor((row) => (row.isActive ? "恢復" : "停權"), {
    id: "isActive",
    header: "",
    cell: (props) => {
      return (
        <div className="flex justify-center">
          <Tablet active={props.cell.row.original.isActive} />
        </div>
      );
    },
    size: 9.2,
  }),
  columnHelper.accessor("account", {
    header: "帳號",
    cell: (props) => props.getValue(),
    size: 10.5,
  }),
  columnHelper.accessor((row) => memberTypeEnChMap[row.appUserType], {
    id: "appUserType",
    header: "會員類別",
    size: 10.5,
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
    size: 13,
  }),
  columnHelper.accessor("phone", {
    header: "電話",
    cell: (props) => props.getValue(),
    size: 15.7,
  }),
  columnHelper.accessor((row) => genderEnChMap[row.gender], {
    id: "gender",
    header: "性別",
    size: 9.2,
  }),
  columnHelper.accessor("birthday", {
    header: "生日",
    cell: (props) => props.getValue(),
    size: 14.5,
  }),
  columnHelper.accessor(
    (row) => new Intl.NumberFormat().format(row.coin).toString(),
    {
      id: "coin",
      header: "累積儲值金額",
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
          to={`/member-management/details/${props.row.original.id}`}
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
  columnHelper.accessor("account", {
    header: "帳號",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
  }),
  columnHelper.display({
    id: "detail-link",
    cell: (props) => {
      return (
        <Link
          to={`/member-management/details/${props.row.original.id}`}
          className="flex justify-end"
        >
          <img src={fileIcon} />
        </Link>
      );
    },
  }),
] as ColumnDef<SimpleMember>[];
