import { Checkbox } from "@/components/ui/checkbox";
import {
  MemberType,
  SimpleMember,
  memberTypeEnChMap,
} from "@/pages/member-management/loader";
import { ColumnDef } from "@tanstack/react-table";

export const inviteMemberscolumns: ColumnDef<SimpleMember>[] = [
  {
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
  },
  {
    accessorKey: "account",
    header: "帳號",
  },
  {
    accessorKey: "chName",
    header: "姓名",
  },
  {
    accessorKey: "phone",
    header: "電話",
  },
  {
    accessorKey: "appUserType",
    header: "會員類別",
    cell: (row) => {
      return memberTypeEnChMap[row.getValue() as MemberType];
    },
  },
];
