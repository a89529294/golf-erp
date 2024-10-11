import pencilIcon from "@/assets/pencil.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/pages/system-management/personnel-management/loader";
import { storeCategoryMap } from "@/utils";
import { linksKV } from "@/utils/links";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const columnHelper = createColumnHelper<Employee>();

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div>
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
      <div className="w-fit whitespace-nowrap">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 48,
  }),
  columnHelper.accessor("idNumber", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          編號
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  }),
  columnHelper.accessor("chName", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          姓名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  }),
  columnHelper.accessor("telphone", {
    header: "電話",
    cell(props) {
      return (
        <div className="whitespace-nowrap">{props.getValue() as string}</div>
      );
    },
  }),
  columnHelper.accessor(
    (row) =>
      row.stores && row.stores[0]
        ? storeCategoryMap[row.stores[0].category]
        : "",
    {
      id: "category",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            分類
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell(props) {
        return (
          <div className="whitespace-nowrap">{props.getValue() as string}</div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
    {
      id: "store-name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            廠商名稱
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell(props) {
        return (
          <div className="whitespace-nowrap">{props.getValue() as string}</div>
        );
      },
    },
  ),
  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="block h-5 w-5"
          to={linksKV["system-management"].subLinks[
            "personnel-system-management"
          ].paths.details.replace(":id", row.original.id)}
        >
          <img src={pencilIcon} className="hidden group-hover:block" />
        </Link>
      );
    },
  }),
] as ColumnDef<Employee, unknown>[];

// export const mobileColumns = [
//   columnHelper.display({
//     id: "select",
//     header: ({ table }) => (
//       <div className="grid h-full place-items-center whitespace-nowrap">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="grid h-full place-items-center whitespace-nowrap">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       </div>
//     ),
//   }),
//   columnHelper.accessor("idNumber", {
//     header: "編號",
//   }),
//   columnHelper.accessor("chName", {
//     header: () => <div className="whitespace-nowrap">姓名</div>,
//     cell: (prop) => <div className="whitespace-nowrap">{prop.getValue()}</div>,
//   }),
//   columnHelper.accessor("telphone", {
//     header: "電話",
//   }),
//   columnHelper.accessor(
//     (row) =>
//       row.stores && row.stores[0]
//         ? storeCategoryMap[row.stores[0].category]
//         : "",
//     {
//       id: "category",
//       header: ({ column }) => {
//         return (
//           <button
//             className="flex items-center gap-1 "
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             分類
//             <ArrowUpDown className="w-4 h-4 ml-2" />
//           </button>
//         );
//       },
//       cell: (prop) => (
//         <div className="whitespace-nowrap">{prop.getValue()}</div>
//       ),
//     },
//   ),
//   columnHelper.accessor(
//     (row) => (row.stores && row.stores[0] ? row.stores[0].name : ""),
//     {
//       id: "storeName",
//       header: () => <div className="whitespace-nowrap">廠商名稱</div>,
//       size: 200,
//       cell: (prop) => (
//         <div className="whitespace-nowrap">{prop.getValue()}</div>
//       ),
//     },
//   ),
//   columnHelper.display({
//     id: "details",
//     header: "",
//     cell: ({ row }) => {
//       return (
//         <Link
//           className="grid w-5 h-5 place-items-center "
//           to={linksKV["system-management"].subLinks[
//             "personnel-system-management"
//           ].paths.details.replace(":id", row.original.id)}
//         >
//           <img src={pencilIcon} className="" />
//         </Link>
//       );
//     },
//   }),
// ] as ColumnDef<Employee, unknown>[];
