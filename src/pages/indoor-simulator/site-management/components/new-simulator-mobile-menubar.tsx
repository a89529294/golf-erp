import backIcon from "@/assets/back.svg";
import saveIcon from "@/assets/save.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenubarSeparator } from "@radix-ui/react-menubar";
import { useNavigate } from "react-router-dom";

export function NewSimulatorMobileMenubar({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu value="category-mobile-menu">
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <button
              disabled={isPending}
              className="flex gap-1"
              onClick={() => navigate(-1)}
            >
              <img src={backIcon} />
              返回
            </button>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onSubmit}>
            <button disabled={isPending} className="flex gap-1">
              <img src={saveIcon} />
              儲存
            </button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
