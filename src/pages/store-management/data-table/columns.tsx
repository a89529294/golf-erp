import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "@/pages/store-management/loader";
import { StoreCategory, storeCategoryMap } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import locationIcon from "@/assets/location-icon.svg";

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
    size: 5,
  },
  {
    id: "name-address",
    header: "廠商名稱 / 地址",
    cell: ({ row }) => (
      <div>
        <p>{row.original.name}</p>
        <p className="flex gap-1">
          <img src={locationIcon} />
          {row.original.county + row.original.district + row.original.address}
        </p>
      </div>
    ),
    size: 25,
  },
  {
    accessorKey: "category",
    header: "類別",
    cell: ({ row }) => storeCategoryMap[row.original.category as StoreCategory],
    size: 15,
  },
  {
    // TODO change this once telphone column is added
    id: "telphone",
    header: "市話",
    cell: () => "022223333",
    size: 15,
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
    size: undefined,
  },
];
