import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/pages/system-management/personnel-management/loader";

import { StoreCategory, storeCategoryMap } from "@/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Employee>();

export const columns = [
  columnHelper.display({
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
  }),
  columnHelper.accessor("idNumber", { header: "編號" }),
  columnHelper.accessor("chName", { header: "姓名" }),
  columnHelper.accessor("telphone", { header: "電話" }),
  columnHelper.accessor(
    (row) =>
      row.stores && row.stores[0]
        ? storeCategoryMap[row.stores[0].category as StoreCategory]
        : "",
    {
      header: "分類",
    },
  ),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    { header: "廠商名稱" },
  ),
] as ColumnDef<Employee, unknown>[];
