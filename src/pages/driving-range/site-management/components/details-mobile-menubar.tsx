import backIcon from "@/assets/back.svg";
import pencilIcon from "@/assets/pencil.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import saveIcon from "@/assets/save.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DetailsMobileMenubar({
  formDisabled,
  isPending,
  dirtyFieldsLength,
  onBackWithoutSave,
  setFormDisabled,
  deleteSite,
  siteName,
  onPatchForm,
}: {
  formDisabled: boolean;
  isPending: boolean;
  dirtyFieldsLength: number;
  onBackWithoutSave: () => void;
  setFormDisabled: (arg: boolean) => void;
  deleteSite: () => void;
  siteName: string;
  onPatchForm: () => void;
}) {
  const navigate = useNavigate();
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
          {formDisabled ? (
            <MenubarItem>
              <button className="flex gap-1" onClick={() => navigate(-1)}>
                <img src={backIcon} />
                返回
              </button>
            </MenubarItem>
          ) : dirtyFieldsLength !== 0 ? (
            <Modal
              onModalClose={() => {
                setValue("");
                console.log("??");
              }}
              dialogTriggerChildren={({ setOpen }) => (
                <MenubarItem
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                    // onBackWithoutSave();
                  }}
                >
                  <button disabled={isPending} className="flex gap-1">
                    <img src={redXIcon} />
                    取消編輯
                  </button>
                </MenubarItem>
              )}
              onSubmit={onBackWithoutSave}
              onClickSubmit={onBackWithoutSave}
            >
              資料尚未儲存，是否返回？
            </Modal>
          ) : (
            <MenubarItem>
              <button
                className="flex gap-1"
                onClick={() => setFormDisabled(true)}
              >
                <img src={redXIcon} />
                取消編輯
              </button>
            </MenubarItem>
          )}

          <MenubarSeparator />

          {formDisabled ? (
            <>
              <Modal
                onModalClose={() => setValue("")}
                dialogTriggerChildren={({ setOpen }) => (
                  <MenubarItem
                    onClick={(e) => {
                      setOpen(true);
                      e.preventDefault();
                    }}
                  >
                    <button className="flex gap-1">
                      <img src={trashCanIcon} />
                      刪除
                    </button>
                  </MenubarItem>
                )}
                onSubmit={deleteSite}
              >
                確認刪除{siteName}?
              </Modal>
              <MenubarSeparator />
              <MenubarItem>
                <button
                  type="button"
                  onClick={() => {
                    setFormDisabled(false);
                  }}
                  className="flex gap-1"
                >
                  <img src={pencilIcon} />
                  編輯
                </button>
              </MenubarItem>
            </>
          ) : (
            <MenubarItem>
              <button
                disabled={isPending || dirtyFieldsLength === 0}
                form="site-details"
                onClick={() => onPatchForm()}
                className="flex gap-1"
              >
                <img src={saveIcon} />
                儲存
              </button>
            </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
