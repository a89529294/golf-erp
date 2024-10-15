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
  columnHelper.accessor("idNumber", { id: "idNumber", header: "編號" }),
  columnHelper.accessor("chName", {
    id: "chName",
    header: "姓名",
    cell(props) {
      return <div className="whitespace-nowrap">{props.getValue()}</div>;
    },
  }),
  columnHelper.accessor("telphone", { id: "telphone", header: "電話" }),
  columnHelper.accessor(
    (row) =>
      row.stores && row.stores[0]
        ? storeCategoryMap[row.stores[0].category as StoreCategory]
        : "",
    {
      id: "storeCategory",
      header: "分類",
      cell(props) {
        return <div className="whitespace-nowrap">{props.getValue()}</div>;
      },
    },
  ),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    {
      header: "廠商名稱",
      id: "storeName",
      cell(props) {
        return <div className="whitespace-nowrap">{props.getValue()}</div>;
      },
    },
  ),
] as ColumnDef<Employee, unknown>[];

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
