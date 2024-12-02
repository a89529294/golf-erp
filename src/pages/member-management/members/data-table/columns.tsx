import fileIcon from "@/assets/black-file-icon.svg";
import { Tablet } from "@/components/tablet";
import { SendPointsModal } from "@/pages/member-management/members/components/send-points-modal";
import { Column, ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { SimpleMember, genderEnChMap, memberTypeEnChMap } from "../loader";
import { ReactNode } from "react";
import { DeleteMemberModal } from "@/pages/member-management/members/components/delete-member-modal";
import { Checkbox } from "@/components/ui/checkbox";

const columnHelper = createColumnHelper<SimpleMember>();

const showSendPoints = (userPermissions: string[]) =>
  userPermissions.includes("系統管理");

const showDeleteMember = (userPermissions: string[]) =>
  userPermissions.includes("系統管理") ||
  userPermissions.includes("系統管理-刪除使用者");

export const genColumns = (
  userPermissions: string[],
  resetCurrentPage: () => void,
) =>
  [
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
      meta: {
        className: "px-2",
      },
    }),
    ...(showSendPoints(userPermissions)
      ? [
          columnHelper.display({
            id: "send_points",
            header: "",
            cell: ({ row }) => {
              return <SendPointsModal userId={row.original.id} />;
            },
            size: 9.2,
            meta: {
              className: "px-2",
            },
          }),
        ]
      : []),
    ...(showDeleteMember(userPermissions)
      ? [
          columnHelper.display({
            id: "send_points",
            header: "",
            cell: ({ row }) => {
              return (
                <DeleteMemberModal
                  userId={row.original.id}
                  userName={row.original.chName}
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
      header: ({ column }) => (
        <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          帳號
        </SortableButton>
      ),
      cell: (props) => props.getValue(),
      size: 10.5,
    }),
    columnHelper.accessor((row) => memberTypeEnChMap[row.appUserType], {
      id: "appUserType",
      header: ({ column }) => (
        <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          會員類別
        </SortableButton>
      ),
      size: 10.5,
    }),
    columnHelper.accessor("chName", {
      header: ({ column }) => (
        <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          姓名
        </SortableButton>
      ),
      cell: (props) => (
        <span className="whitespace-nowrap">{props.getValue()}</span>
      ),
      size: 13,
    }),
    columnHelper.accessor("phone", {
      id: "phone",
      header: () => <div>電話</div>,
      cell: (props) => props.getValue() as string,
      size: 11.7,
    }),
    columnHelper.accessor((row) => genderEnChMap[row.gender], {
      id: "gender",
      header: ({ column }) => (
        <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          性別
        </SortableButton>
      ),
      size: 8,
    }),
    columnHelper.accessor("birthday", {
      header: ({ column }) => (
        <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          生日
        </SortableButton>
      ),
      cell: (props) => (
        <div className="whitespace-nowrap">{props.getValue()}</div>
      ),
      size: 11.5,
    }),
    columnHelper.accessor(
      (row) =>
        new Intl.NumberFormat()
          .format(
            (row.storeAppUsers ?? []).reduce((acc, val) => acc + val.coin, 0),
          )
          .toString(),
      {
        id: "storeAppUser.coin",
        header: ({ column }) =>
          // <SortableButton resetCurrentPage={resetCurrentPage} column={column}>
          //   累積儲值金額
          // </SortableButton>
          "累積儲值金額",
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
            to={`/member-management/members/details/${props.row.original.id}`}
            className="hidden group-hover:block sm:block"
          >
            <img src={fileIcon} />
          </Link>
        );
      },
      size: 4,
    }),
  ] as ColumnDef<SimpleMember>[];

export const mobileColumns = [
  // columnHelper.display({
  //   id: "send_points",
  //   header: "",
  //   cell: () => {
  //     return (
  //       <Modal dialogTriggerChildren={<TabletSendPoints />} onSubmit={() => {}}>
  //         <div className="">
  //           <h1 className="mb-1 text-center">數入點數</h1>
  //           <input className="text-center" type="number" />
  //         </div>
  //       </Modal>
  //     );
  //   },
  //   size: 40,
  // }),
  columnHelper.accessor("account", {
    header: "帳號",
    cell: (props) => props.getValue(),
    size: 20,
  }),
  columnHelper.accessor("chName", {
    header: "姓名",
    cell: (props) => (
      <span className="whitespace-nowrap">{props.getValue()}</span>
    ),
    size: 30,
  }),
  columnHelper.display({
    id: "detail-link",
    cell: (props) => {
      return (
        <Link
          to={`/member-management/members/details/${props.row.original.id}`}
          className="flex justify-center"
        >
          <img src={fileIcon} className="" />
        </Link>
      );
    },
    size: 10,
  }),
] as ColumnDef<SimpleMember>[];

function SortableButton({
  column,
  children,
  resetCurrentPage,
}: {
  column: Column<SimpleMember>;
  children: ReactNode;
  resetCurrentPage: () => void;
}) {
  return (
    <button
      className="flex items-center gap-1 whitespace-nowrap"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
        resetCurrentPage();
      }}
    >
      {children}
      {column.getIsSorted() === false ? (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      )}
    </button>
  );
}
