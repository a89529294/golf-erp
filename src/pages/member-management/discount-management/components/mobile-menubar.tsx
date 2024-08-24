import backIcon from "@/assets/back.svg";
import saveIcon from "@/assets/save.svg";
import pencilIcon from "@/assets/pencil.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MobileMenubar({
  isPending,
  onSubmit,
  isEditing,
  startEdit,
  cancelEdit,
  //   trigger,
}: {
  isPending: boolean;
  onSubmit: () => void;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  //   trigger: () => void;
}) {
  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {isEditing ? (
            <>
              <MenubarItem>
                <button
                  type="button"
                  disabled={isPending}
                  className="flex gap-1"
                  form="discount-form"
                  onClick={cancelEdit}
                >
                  <img src={backIcon} />
                  返回
                </button>
              </MenubarItem>
              <MenubarSeparator />

              <MenubarItem>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex gap-1"
                  form="discount-form"
                  onClick={onSubmit}
                >
                  <img src={saveIcon} />
                  儲存
                </button>
              </MenubarItem>
            </>
          ) : (
            <MenubarItem>
              <button
                type="button"
                disabled={isPending}
                className="flex gap-1"
                form="discount-form"
                onClick={startEdit}
              >
                <img src={pencilIcon} />
                編輯
              </button>
            </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
