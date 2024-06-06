import pencilIcon from "@/assets/pencil.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { linksKV } from "@/utils/links";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

type Appointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  site: string;
  fee: number;
  headcont: number;
};

const columnHelper = createColumnHelper<Appointment>();

export const columns = [
  columnHelper.display({
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
  }),
  columnHelper.accessor("title", {
    header: "標題",
  }),
  columnHelper.accessor("date", {
    header: "日期",
  }),
  columnHelper.accessor("time", {
    header: "時段",
  }),
  columnHelper.accessor("site", {
    header: "球場",
  }),
  columnHelper.accessor("fee", {
    header: "費用",
  }),
  columnHelper.accessor("headcont", {
    header: "邀約人數",
  }),

  columnHelper.display({
    id: "details",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          className="block h-5 w-5"
          to={linksKV["golf"].subLinks[
            "appointment-management"
          ].paths.details.replace(":appointmentId", row.original.id)}
        >
          <img src={pencilIcon} className="hidden group-hover:block" />
        </Link>
      );
    },
  }),
] as ColumnDef<Appointment, unknown>[];
