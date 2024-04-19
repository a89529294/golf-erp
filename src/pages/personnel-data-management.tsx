import { IconButton } from "@/components/ui/button";
import { UserDisplayLogout } from "@/components/user-display-logout";

export default function PersonnelDataManagement() {
  return (
    <div className="relative flex flex-col gap-2.5 px-2.5">
      <header className="flex h-20 items-end gap-2.5">
        <IconButton icon="plus">新增人員</IconButton>
        <IconButton icon="magnifyingGlass" />

        <UserDisplayLogout />
      </header>
      <div></div>
    </div>
  );
}
