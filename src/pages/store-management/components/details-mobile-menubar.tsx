import backIcon from "@/assets/back.svg";
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
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function DetailsMobileMenubar<T extends FieldValues>({
  disabled,
  form,
  isMutating,
  setDisabled,
  onDeleteStore,
  onPatchStore,
  storeName,
}: {
  disabled: boolean;
  form: UseFormReturn<T>;
  isMutating: boolean;
  setDisabled: (arg: boolean) => void;
  onDeleteStore: () => Promise<void>;
  onPatchStore: () => void;
  storeName: string;
}) {
  const navigate = useNavigate();
  const [menuValue, setMenuValue] = useState("");

  return (
    <Menubar
      value={menuValue}
      onValueChange={setMenuValue}
      className="h-auto bg-transparent border-none"
    >
      <MenubarMenu value="details-store-management-menu">
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {disabled ? (
            <>
              <MenubarItem>
                <button
                  className="flex gap-1"
                  onClick={() => navigate("/store-management?category=all")}
                >
                  <img src={backIcon} />
                  返回
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          ) : Object.keys(form.formState.dirtyFields).length !== 0 ? (
            <Modal
              dialogTriggerChildren={
                <>
                  <MenubarItem>
                    <button disabled={isMutating} className="flex gap-1">
                      <img src={redXIcon} />
                      取消編輯
                    </button>
                  </MenubarItem>
                  <MenubarSeparator />
                </>
              }
              onSubmit={() => {
                setDisabled(true);
                form.reset();
              }}
            >
              資料尚未儲存，是否返回？
            </Modal>
          ) : (
            <>
              <MenubarItem>
                <button
                  className="flex gap-1"
                  onClick={() => setDisabled(true)}
                >
                  <img src={redXIcon} />
                  取消編輯
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          )}

          {disabled ? (
            <>
              <Modal
                onModalClose={() => setMenuValue("")}
                dialogTriggerChildren={({ setOpen }) => {
                  return (
                    <>
                      <MenubarItem
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(true);
                        }}
                      >
                        <button
                          className="flex gap-1"
                          disabled={isMutating}
                          type="button"
                        >
                          <img src={trashCanIcon} />
                          刪除
                        </button>
                      </MenubarItem>
                      <MenubarSeparator />
                    </>
                  );
                }}
                onSubmit={onDeleteStore}
                title={`是否刪除${storeName}`}
              />
              <MenubarItem>
                <button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      setDisabled(false);
                    }, 0);
                  }}
                  className="flex gap-1"
                >
                  <img src={saveIcon} />
                  編輯
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          ) : (
            <>
              <MenubarItem onClick={onPatchStore}>
                <button
                  disabled={isMutating || !form.formState.isDirty}
                  form="store-form"
                  type="submit"
                  className="flex gap-1"
                >
                  <img src={saveIcon} />
                  儲存
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
