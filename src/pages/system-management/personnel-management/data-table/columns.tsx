import pencilIcon from "@/assets/pencil.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/pages/system-management/personnel-management/loader";
import { storeCategoryMap } from "@/utils";
import { linksKV } from "@/utils/links";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
    size: 10,
  }),
  columnHelper.accessor("idNumber", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          編號
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    size: 12,
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
    size: 12,
  }),
  columnHelper.accessor("telphone", {
    header: "電話",
    size: 15,
  }),
  columnHelper.accessor(
    (row) =>
      row.stores && row.stores[0]
        ? storeCategoryMap[row.stores[0].category]
        : "",
    {
      id: "category",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            分類
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      size: 15,
    },
  ),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    {
      id: "store-name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            廠商名稱
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
    },
  ),
  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="block h-5 w-5"
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
          className="grid h-5 w-5 place-items-center"
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
