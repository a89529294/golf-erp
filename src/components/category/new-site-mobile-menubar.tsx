import backIcon from "@/assets/back.svg";
import saveIcon from "@/assets/save.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarSeparator,
  MenubarTrigger,
  MenubarMenu,
  MenubarItem,
} from "@/components/ui/menubar";

import { useNavigate } from "react-router-dom";

export function NewSiteMobileMenubar({
  isPending,
  onSave,
}: {
  isPending: boolean;
  onSave: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Menubar className="h-auto bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <button
              className="flex gap-1"
              onClick={() => navigate(-1)}
              disabled={isPending}
            >
              <img src={backIcon} />
              返回
            </button>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <button
              className="flex gap-1"
              form="site-details"
              disabled={isPending}
              onClick={onSave}
            >
              <img src={saveIcon} />
              儲存
            </button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
