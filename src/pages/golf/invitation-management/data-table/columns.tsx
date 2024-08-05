import pencilIcon from "@/assets/pencil.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { linksKV } from "@/utils/links";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Invitation } from "../loader";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<Invitation>();

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
  columnHelper.accessor("title", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          標題
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("date", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          日期
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("time", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          時段
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("store.name", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          球場
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          費用
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),
  columnHelper.accessor("inviteCount", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          要約人數
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  }),

  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="block h-5 w-5"
          to={linksKV["golf"].subLinks[
            "invitation-management"
          ].paths.details.replace(":invitationId", row.original.id)}
        >
          <img src={pencilIcon} className="hidden group-hover:block" />
        </Link>
      );
    },
  }),
] as ColumnDef<Invitation, unknown>[];
