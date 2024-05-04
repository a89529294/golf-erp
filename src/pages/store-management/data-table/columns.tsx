import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "@/pages/store-management/loader";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Store>[] = [
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
    id: "name-address",
    header: "廠商名稱 / 地址",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p>{row.original.name}</p>
        <p>
          {row.original.county + row.original.district + row.original.address}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "類別",
  },
  {
    // TODO change this once telphone column is added
    id: "telphone",
    header: "市話",
    cell: () => "022223333",
  },
  {
    id: "contact-name-phone",
    header: "聯絡人 / 電話",
    cell: () => (
      <div>
        <p>王小明</p>
        <p>021233211</p>
      </div>
    ),
  },
];
