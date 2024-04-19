import { columns } from "@/components/personnel-data-management-table/columns";
import { DataTable } from "@/components/personnel-data-management-table/data-table";
import { IconButton } from "@/components/ui/button";
import { UserDisplayLogout } from "@/components/user-display-logout";

export const personnel = [
  {
    id: "728ed52f",
    name: "大名",
    phoneno: "0900111222",
    classification: "高爾夫",
    clientName: "高仕高爾夫練習場-西屯朝馬總店",
  },
  {
    id: "234fg12a",
    name: "小名",
    phoneno: "0900333444",
    classification: "高爾夫",
    clientName: "高仕高爾夫練習場-西屯朝馬總店",
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
        <DataTable columns={columns} data={personnel} />
      </div>
    </div>
  );
}
