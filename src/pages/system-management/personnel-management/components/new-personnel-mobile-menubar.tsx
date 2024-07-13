import backIcon from "@/assets/back.svg";
import saveIcon from "@/assets/save.svg";
import { Modal } from "@/components/modal";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

export function NewPersonnelMobileMenubar({
  isDirty,
  isMutating,
  onSubmit,
}: {
  isDirty: boolean;
  isMutating: boolean;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {isDirty ? (
            <Modal
              dialogTriggerChildren={
                <MenubarItem>
                  <button disabled={isMutating} className="flex gap-1">
                    <img src={backIcon} />
                    返回
                  </button>
                </MenubarItem>
              }
              onSubmit={() => navigate(-1)}
              title="資料尚未儲存，是否返回列表？"
            />
          ) : (
            <MenubarItem>
              <button
                disabled={isMutating}
                className="flex gap-1"
                onClick={() => navigate(-1)}
              >
                <img src={backIcon} />
                返回
              </button>
            </MenubarItem>
          )}
          <MenubarSeparator />
          <MenubarItem>
            <button
              disabled={isMutating}
              className="flex gap-1"
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
