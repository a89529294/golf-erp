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
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "chName",
    id: "chName",
    header: "姓名",
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "telphone",
    id: "telphone",
    header: "電話",
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "storeCategory",
    id: "storeCategory",
    header: "分類",
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "store.name",
    id: "storeName",
    header: "廠商名稱",
    cell(props) {
      return (
        <div className="sm:whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  },
];

// export const mobileColumns = columns.map((c) => {
//   const sizeMap = {
//     select: 60,
//     idNumber: 100,
//     chName: 100,
//     telphone: 120,
//     storeCategory: 100,
//     storeName: 160,
//   } as Record<string, number>;

//   return {
//     ...c,
//     size: sizeMap[c.id!],
//   };
// });
