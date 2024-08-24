import backIcon from "@/assets/back.svg";
import saveIcon from "@/assets/save.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { linksKV } from "@/utils/links";
import { Link } from "react-router-dom";

export function NewFormMobileMenubar({
  isPending,
  onSubmit,
  //   trigger,
}: {
  isPending: boolean;
  onSubmit: () => void;
  //   trigger: () => void;
}) {
  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link
              className={cn(
                "flex gap-1",
                isPending ? "cursor-not-allowed opacity-50" : "",
              )}
              to={
                isPending
                  ? window.location.pathname
                  : linksKV["member-management"].subLinks["members"].paths[
                      "index"
                    ]
              }
            >
              <img src={backIcon} />
              返回
            </Link>
          </MenubarItem>
          <MenubarSeparator />

          <MenubarItem>
            <button
              type="submit"
              disabled={isPending}
              className="flex gap-1"
              form="member-form"
              onClick={onSubmit}
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
