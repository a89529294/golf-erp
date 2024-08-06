// import { Tablet } from "@/components/tablet";
// import { Coupon } from "@/pages/driving-range/coupon-management/loader";
// import { createColumnHelper } from "@tanstack/react-table";
// import { ArrowUpDown } from "lucide-react";

// const columnHelper = createColumnHelper<Coupon>();

// export const columns = [
//   columnHelper.accessor((row) => (row.isActive ? "有效" : "無效"), {
//     id: "isActive",
//     header: "",
//     cell: (props) => {
//       return (
//         <div className="flex justify-center">
//           <Tablet active={props.cell.row.original.isActive} />
//         </div>
//       );
//     },
//   }),
//   columnHelper.accessor("name", {
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           標題
//           <ArrowUpDown className="w-4 h-4 ml-2" />
//         </button>
//       );
//     },
//     cell: (props) => props.getValue(),
//     size: 50,
//   }),

//   columnHelper.accessor("expiration", {
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           使用期限
//           <ArrowUpDown className="w-4 h-4 ml-2" />
//         </button>
//       );
//     },
//     cell: (props) => (
//       <span className="whitespace-nowrap">{props.getValue()}</span>
//     ),
//   }),
//   columnHelper.accessor("amount", {
//     header: "金額",
//     cell: (props) => props.getValue(),
//   }),

//   columnHelper.accessor("birthday", {
//     header: ({ column }) => {
//       return (
//         <button
//           className="flex items-center gap-1"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           生日
//           <ArrowUpDown className="w-4 h-4 ml-2" />
//         </button>
//       );
//     },
//     cell: (props) => props.getValue(),
//     size: 11.5,
//   }),
//   columnHelper.accessor(
//     (row) => {
//       return new Intl.NumberFormat()
//         .format(
//           row.appChargeHistories.reduce(
//             (acc, val) => (val.store.id === storeId ? acc + val.amount : acc),
//             0,
//           ),
//         )
//         .toString();
//     },
//     {
//       id: "coin",
//       header: ({ column }) => {
//         return (
//           <button
//             className="flex items-center gap-1"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             累積儲值金額
//             <ArrowUpDown className="w-4 h-4 ml-2" />
//           </button>
//         );
//       },
//       cell: (props) => {
//         return (
//           <div className="flex gap-1">
//             $
//             <div className="font-medium text-line-green">
//               {props.getValue()}
//             </div>
//           </div>
//         );
//       },
//       size: undefined,
//     },
//   ),
//   columnHelper.display({
//     id: "detail-link",
//     cell: (props) => {
//       return (
//         <Link
//           to={`/${categoryToLink[category]}/member-management/details/${props.row.original.id}?storeId=${storeId}`}
//           className="hidden group-hover:block"
//         >
//           <img src={fileIcon} />
//         </Link>
//       );
//     },
//     size: 4,
//   }),
// ] as ColumnDef<Member>[];
