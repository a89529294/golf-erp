import pencilIcon from "@/assets/pencil.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import saveIcon from "@/assets/save.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";

export function MobileMenubar({
  isEditing,
  isPending,
  onBackWithoutSave,
  setFormState,
  onPatchForm,
}: {
  isEditing: boolean;
  isPending: boolean;
  onBackWithoutSave: () => void;
  setFormState: (arg: boolean) => void;
  onPatchForm: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <Menubar
      value={value}
      onValueChange={setValue}
      className="h-auto border-none bg-transparent"
    >
      <MenubarMenu value="ground-details-mobile-menu">
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {!isEditing ? (
            <>
              <MenubarItem>
                <button
                  type="button"
                  onClick={() => {
                    setFormState(true);
                  }}
                  className="flex gap-1"
                >
                  <img src={pencilIcon} />
                  編輯
                </button>
              </MenubarItem>
            </>
          ) : (
            <>
              <MenubarItem>
                <button
                  className="flex gap-1"
                  onClick={() => {
                    setFormState(false);
                    onBackWithoutSave();
                  }}
                >
                  <img src={redXIcon} />
                  取消編輯
                </button>
              </MenubarItem>
              <MenubarItem>
                <button
                  disabled={isPending}
                  form="site-details"
                  onClick={() => onPatchForm()}
                  className="flex gap-1"
                >
                  <img src={saveIcon} />
                  儲存
                </button>
              </MenubarItem>
            </>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
