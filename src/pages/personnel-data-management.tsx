import { columns } from "@/components/personnel-data-management-table/columns";
import { DataTable } from "@/components/personnel-data-management-table/data-table";
import { IconButton } from "@/components/ui/button";
import { UserDisplayLogout } from "@/components/user-display-logout";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

export default function PersonnelDataManagement() {
  return (
    <div className="relative flex flex-col gap-2.5 px-2.5">
      <header className="relative flex h-20 items-end gap-2.5">
        <IconButton icon="plus">新增人員</IconButton>
        <IconButton icon="magnifyingGlass" />

        <UserDisplayLogout />
      </header>
      <div>
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
}
