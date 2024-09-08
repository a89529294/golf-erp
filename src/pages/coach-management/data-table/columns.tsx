import { Coach } from "@/pages/coach-management/loader";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Coach>[] = [
  {
    accessorKey: "avatarFileId",
    id: "avatar",
    header: "大頭照",
    cell: ({ row }) => (
      <div className="h-10 w-10">
        <img className="object-contain " alt="" src={row.original.avatarSrc} />
      </div>
    ),
  },
  {
    id: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          名字
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p>{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    id: "phone",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          電話
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "verificationStatus",
    id: "verificationStatus",
    header: "審核狀態",
    cell: ({ row }) => row.original.status ?? "",
  },
] as ColumnDef<Coach>[];
