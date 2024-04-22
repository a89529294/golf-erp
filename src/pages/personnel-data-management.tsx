import { columns } from "@/components/personnel-data-management-table/columns";
import { DataTable } from "@/components/personnel-data-management-table/data-table";
import { IconButton } from "@/components/ui/button";
import { UserDisplayLogout } from "@/components/user-display-logout";
import { personnel } from "@/utils/temp-data";

export default function PersonnelDataManagement() {
  return (
    <div className="relative flex flex-col px-2.5 ">
      <header className="sticky top-0 z-10  flex h-20 flex-shrink-0 items-end gap-2.5 bg-white">
        <IconButton icon="plus">新增人員</IconButton>
        <IconButton icon="magnifyingGlass" />

        <UserDisplayLogout />
      </header>
      <div className="sticky top-20 z-10 h-2.5 bg-white" />
      <div className="relative ">
        <DataTable columns={columns} data={personnel} />
      </div>
    </div>
  );
}
