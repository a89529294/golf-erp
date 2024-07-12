import pencilIcon from "@/assets/pencil.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/pages/system-management/personnel-management/loader";
import { storeCategoryMap } from "@/utils";
import { linksKV } from "@/utils/links";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

const columnHelper = createColumnHelper<Employee>();

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  }),
  columnHelper.accessor("idNumber", {
    header: "編號",
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
  }),
  columnHelper.accessor("telphone", {
    header: "電話",
  }),
  columnHelper.accessor(
    (row) =>
      row.stores && row.stores[0]
        ? storeCategoryMap[row.stores[0].category]
        : "",
    {
      header: "分類",
    },
  ),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    {
      header: "廠商名稱",
    },
  ),
  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="block w-5 h-5"
          to={linksKV["system-management"].subLinks[
            "personnel-system-management"
          ].paths.details.replace(":id", row.original.id)}
        >
          <img src={pencilIcon} className="hidden group-hover:block" />
        </Link>
      );
    },
  }),
] as ColumnDef<Employee, unknown>[];

export const mobileColumns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 80,
  }),
  columnHelper.accessor("idNumber", {
    header: "編號",
    size: 120,
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
    size: 130,
  }),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    {
      header: "廠商名稱",
      size: 200,
    },
  ),
  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="grid w-5 h-5 place-items-center"
          to={linksKV["system-management"].subLinks[
            "personnel-system-management"
          ].paths.details.replace(":id", row.original.id)}
        >
          <img src={pencilIcon} className="" />
        </Link>
      );
    },
    size: 60,
  }),
] as ColumnDef<Employee, unknown>[];
