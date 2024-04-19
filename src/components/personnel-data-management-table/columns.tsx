import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Personnel = {
  id: string;
  name: string;
  phoneno: string;
  classification: string;
  clientName: string;
};

export const columns: ColumnDef<Personnel>[] = [
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
  {
    accessorKey: "id",
    header: "編號",
  },
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "phoneno",
    header: "電話",
  },
  {
    accessorKey: "classification",
    header: "分類",
  },
  {
    accessorKey: "clientName",
    header: "廠商名稱",
  },
];
