import { Checkbox } from "@/components/ui/checkbox";
import { AppPermissionUser } from "@/pages/system-management/app-permission-management/loader";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AppPermissionUser>[] = [
  {
    id: "select",
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
  {
    accessorKey: "idNumber",
    id: "idNumber",
    header: "編號",
  },
  {
    accessorKey: "chName",
    id: "chName",
    header: "姓名",
  },
  {
    accessorKey: "telphone",
    id: "telphone",
    header: "電話",
  },
  {
    accessorKey: "storeCategory",
    id: "storeCategory",
    header: "分類",
  },
  {
    accessorKey: "store.name",
    id: "storeName",
    header: "廠商名稱",
  },
];

export const mobileColumns = columns.map((c) => {
  const sizeMap = {
    select: 60,
    idNumber: 100,
    chName: 100,
    telphone: 120,
    storeCategory: 100,
    storeName: 160,
  } as Record<string, number>;

  return {
    ...c,
    size: sizeMap[c.id!],
  };
});
