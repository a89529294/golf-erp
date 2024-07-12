import locationIcon from "@/assets/location-icon.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "@/pages/store-management/loader";
import { storeCategoryMap } from "@/utils";
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
    size: 80,
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
    accessorFn: (row) =>
      `${row.name} ${row.county} ${row.district} ${row.address}`,
  },
  {
    accessorKey: "category",
    id: "category",
    header: "類別",
    accessorFn: (row) => storeCategoryMap[row.category],
  },
  {
    accessorKey: "telphone",
    id: "telphone",
    header: "市話",
    accessorFn: (row) => row.telphone ?? "",
  },
  {
    id: "contact-name-phone",
    header: "聯絡人 / 電話",
    accessorFn: (row) => `${row.contact} ${row.contactPhone}`,
    cell: ({ row }) => (
      <>
        <p>{row.original.contact}</p>
        <p>{row.original.contactPhone}</p>
      </>
    ),
  },
];

export const mobileColumns = columns.map((c) => {
  const sizeMap = {
    select: 80,
    "name-address": 180,
    category: 120,
    telphone: 120,
    "contact-name-phone": 180,
  } as Record<string, number>;
  return {
    ...c,
    size: sizeMap[c.id!],
  };
});
