import fileIcon from "@/assets/black-file-icon.svg";
import { AddCoinModal } from "@/components/category/add-coin-modal";
import { Tablet } from "@/components/tablet";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteMemberModal } from "@/pages/member-management/members/components/delete-member-modal";
import {
  Member,
  genderEnChMap,
  memberTypeEnChMap,
} from "@/pages/member-management/members/loader";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const columnHelper = createColumnHelper<Member>();

const categoryToLink = {
  ground: "driving-range",
  golf: "golf",
  simulator: "indoor-simulator",
};

const showSendPoints = (category: string, userPermissions: string[]) => {
  if (category === "ground" && userPermissions.includes("練習場-贈送點數"))
    return true;

  if (category === "simulator" && userPermissions.includes("模擬器-贈送點數"))
    return true;

  if (category === "golf" && userPermissions.includes("高爾夫球-贈送點數"))
    return true;

  return false;
};

const showDeleteMember = (category: string, userPermissions: string[]) => {
  if (
    category === "ground" &&
    (userPermissions.includes("練習場-刪除使用者") ||
      userPermissions.includes("系統管理") ||
      userPermissions.includes("系統管理-刪除使用者"))
  )
    return true;

  if (
    category === "simulator" &&
    (userPermissions.includes("模擬器-刪除使用者") ||
      userPermissions.includes("系統管理") ||
      userPermissions.includes("系統管理-刪除使用者"))
  )
    return true;

  return false;
};

export const columns = (
  storeId: string,
  category: "ground" | "simulator" | "golf",
  userPermissions: string[],
) => {
  return [
    columnHelper.display({
      id: "checkbox",
      size: 3,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    }),

    columnHelper.accessor((row) => (row.isActive ? "恢復" : "停權"), {
      id: "isActive",
      header: "",
      cell: (props) => {
        return (
          <div className="flex justify-center">
            <Tablet
              active={props.cell.row.original.isActive}
              value={props.getValue()}
            />
          </div>
        );
      },
      size: 5.2,
      meta: { className: "px-2" },
    }),

    ...(showSendPoints(category, userPermissions)
      ? [
          columnHelper.display({
            id: "send_points",
            header: "",
            cell: (props) => {
              const appUserId = props.row.original.id;
              return <AddCoinModal appUserId={appUserId} storeId={storeId} />;
            },
            size: 9.2,
            meta: {
              className: "px-2 ",
            },
          }),
        ]
      : []),
    ...(showDeleteMember(category, userPermissions)
      ? [
          columnHelper.display({
            id: "delete_member",
            header: "",
            cell: (props) => {
              const appUserId = props.row.original.id;
              const appUserName = props.row.original.chName;
              return (
                <DeleteMemberModal
                  category={category}
                  userId={appUserId}
                  userName={appUserName}
                />
              );
            },
            size: 5.2,
            meta: {
              className: "px-2",
            },
          }),
        ]
      : []),
    columnHelper.accessor("account", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            帳號
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => props.getValue(),
      size: 10.5,
    }),
    columnHelper.accessor((row) => memberTypeEnChMap[row.appUserType], {
      id: "appUserType",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            會員類別
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      size: 10.5,
    }),
    columnHelper.accessor("chName", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            姓名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => (
        <span className="whitespace-nowrap">{props.getValue()}</span>
      ),
      size: 10,
    }),
    columnHelper.accessor("phone", {
      header: () => <div className="whitespace-nowrap">電話</div>,
      cell: (props) => props.getValue(),
      size: 11.7,
    }),
    columnHelper.accessor((row) => genderEnChMap[row.gender], {
      id: "gender",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            性別
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      size: 8,
    }),
    columnHelper.accessor("birthday", {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            生日
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: (props) => (
        <div className="whitespace-nowrap">{props.getValue()}</div>
      ),
      size: 11.5,
    }),
    columnHelper.accessor(
      (row) => {
        return new Intl.NumberFormat()
          .format(
            row.appChargeHistories.reduce(
              (acc, val) =>
                val.store?.id === storeId ? acc + val.amount : acc,
              0,
            ),
          )
          .toString();
      },
      {
        id: "coin",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-1 whitespace-nowrap"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              累積儲值金額
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          );
        },
        cell: (props) => {
          return (
            <div className="flex gap-1">
              $
              <div className="font-medium text-line-green">
                {props.getValue()}
              </div>
            </div>
          );
        },
        size: undefined,
      },
    ),
    columnHelper.display({
      id: "detail-link",
      cell: (props) => {
        return (
          <Link
            to={`/${categoryToLink[category]}/member-management/details/view-only/${props.row.original.id}?storeId=${storeId}`}
            className="hidden group-hover:block sm:block"
          >
            <img src={fileIcon} />
          </Link>
        );
      },
      size: 4,
    }),
  ] as ColumnDef<Member>[];
};

// export const mobileColumns = (
//   storeId: string,
//   category: "ground" | "simulator" | "golf",
//   userPermissions: string[],
// ) =>
//   [
//     ...(showSendPoints(category, userPermissions)
//       ? [
//           columnHelper.display({
//             id: "send_points",
//             header: "",
//             cell: (props) => {
//               const appUserId = props.row.original.id;
//               return <AddCoinModal appUserId={appUserId} storeId={storeId} />;
//             },
//             size: 40,
//           }),
//         ]
//       : []),
//     columnHelper.accessor("account", {
//       header: ({ column }) => {
//         return (
//           <button
//             className="flex items-center gap-1"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             帳號
//             <ArrowUpDown className="w-4 h-4 ml-2" />
//           </button>
//         );
//       },
//       cell: (props) => props.getValue(),
//       size: showSendPoints(category, userPermissions) ? 20 : 30,
//     }),
//     columnHelper.accessor("chName", {
//       header: "姓名",
//       cell: (props) => (
//         <span className="whitespace-nowrap">{props.getValue()}</span>
//       ),
//       size: showSendPoints(category, userPermissions) ? 30 : 50,
//     }),
//     columnHelper.display({
//       id: "detail-link",
//       cell: (props) => {
//         return (
//           <Link
//             to={`/${categoryToLink[category]}/member-management/details/${props.row.original.id}?storeId=${storeId}`}
//             className="flex justify-center"
//           >
//             <img src={fileIcon} className="" />
//           </Link>
//         );
//       },
//       size: showSendPoints(category, userPermissions) ? 10 : 20,
//     }),
//   ] as ColumnDef<Member>[];
