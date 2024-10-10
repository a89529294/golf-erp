import { Coach } from "@/pages/coach-management/loader";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Coach>[] = [
  {
    accessorKey: "avatarFileId",
    id: "avatar",
    header: <div className="whitespace-nowrap">大頭照</div>,
    cell: ({ row }) => (
      <div className="h-10 w-10">
        <img
          className="h-full w-full object-contain"
          alt=""
          src={row.original.avatarURI}
        />
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
    header: <div className="whitespace-nowrap">審核狀態</div>,
    cell: ({ row }) => row.original.status ?? "",
    size: 200,
  },
] as ColumnDef<Coach>[];
