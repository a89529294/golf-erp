import { Checkbox } from "@/components/ui/checkbox";
import { UserWithEmployee } from "@/pages/system-management/system-operation-management/loader";
import { PasswordModal } from "@/pages/system-management/system-operation-management/password-modal/modal";
import { StoreCategory, storeCategoryMap } from "@/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<UserWithEmployee>();

export const columns: ColumnDef<UserWithEmployee>[] = [
  {
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
      <div className="grid h-full place-items-center whitespace-nowrap">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 10,
  },
  columnHelper.display({
    id: "password",
    header: "密碼",
    cell: ({ row }) => {
      return <PasswordModal id={row.id} chName={row.original.username} />;
    },
    size: 10,
  }),
  {
    accessorKey: "idNumber",
    id: "idNumber",
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
    accessorFn: (user) => user.employee.idNumber,
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
    size: 12,
  },
  {
    accessorKey: "chName",
    id: "chName",
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
    accessorFn: (user) => user.employee.chName,
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
    size: 12,
  },
  {
    accessorKey: "telphone",
    id: "telphone",
    header: "電話",
    accessorFn: (user) => user.employee.telphone,
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
    size: 15,
  },
  {
    accessorKey: "storeCategory",
    id: "storeCategory",
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
    accessorFn: (user) => {
      if (!user.employee.stores || !user.employee.stores[0]) return "";
      return storeCategoryMap[
        user.employee.stores?.[0].category as StoreCategory
      ];
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
    size: 12,
  },
  {
    id: "storeName",
    accessorKey: "storeName",
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
    accessorFn: (user) => {
      if (!user.employee.stores || !user.employee.stores[0]) return "";
      return user.employee.stores?.[0].name;
    },
    cell: (prop) => (
      <div className="whitespace-nowrap">{prop.getValue() as string}</div>
    ),
  },
];

// export const mobileColumns = columns.map((c) => {
//   const sizeMap = {
//     select: 80,
//     password: 80,
//     idNumber: 120,
//     chName: 100,
//     telphone: 140,
//     storeCategory: 130,
//     storeName: 160,
//   } as Record<string, number>;

//   return {
//     ...c,
//     size: sizeMap[c.id!],
//   };
// });
