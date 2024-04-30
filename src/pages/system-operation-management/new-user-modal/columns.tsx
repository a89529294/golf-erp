import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/pages/personnel-data-management/loader";
import { StoreCategory, storeCategoryMap } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Employee>[] = [
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
    header: "編號",
  },
  {
    accessorKey: "chName",
    header: "姓名",
  },
  {
    accessorKey: "telphone",
    header: "電話",
  },
  {
    accessorKey: "stores.0.category",
    header: "分類",
    cell: (props) => storeCategoryMap[props.cell.getValue() as StoreCategory],
  },
  {
    accessorKey: "stores.0.name",
    header: "廠商名稱",
  },
];
