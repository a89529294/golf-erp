import { Checkbox } from "@/components/ui/checkbox";
import { UserWithEmployee } from "@/pages/system-management/system-operation-management/loader";
import { PasswordModal } from "@/pages/system-management/system-operation-management/password-modal/modal";
import { StoreCategory, storeCategoryMap } from "@/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

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
      <div className="grid h-full place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  columnHelper.display({
    id: "password",
    header: "密碼",
    cell: ({ row }) => {
      return <PasswordModal id={row.id} chName={row.original.username} />;
    },
  }),
  {
    accessorKey: "idNumber",
    id: "idNumber",
    header: "編號",
    accessorFn: (user) => user.employee.idNumber,
  },
  {
    accessorKey: "chName",
    id: "chName",
    header: "姓名",
    accessorFn: (user) => user.employee.chName,
  },
  {
    accessorKey: "telphone",
    id: "telphone",
    header: "電話",
    accessorFn: (user) => user.employee.telphone,
  },
  {
    accessorKey: "storeCategory",
    id: "storeCategory",
    header: "分類",
    accessorFn: (user) => {
      if (!user.employee.stores || !user.employee.stores[0]) return "";
      return storeCategoryMap[
        user.employee.stores?.[0].category as StoreCategory
      ];
    },
  },
  {
    id: "storeName",
    accessorKey: "storeName",
    header: "廠商名稱",
    accessorFn: (user) => {
      if (!user.employee.stores || !user.employee.stores[0]) return "";
      return user.employee.stores?.[0].name;
    },
  },
];

export const mobileColumns = columns.map((c) => {
  const sizeMap = {
    select: 80,
    password: 80,
    idNumber: 120,
    chName: 100,
    telphone: 140,
    storeCategory: 130,
    storeName: 160,
  } as Record<string, number>;

  return {
    ...c,
    size: sizeMap[c.id!],
  };
});
