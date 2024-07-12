import backIcon from "@/assets/back.svg";
import pencilIcon from "@/assets/pencil.svg";
import redXIcon from "@/assets/red-x-icon.svg";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DetailsMobileMenubar({
  isBasicInfoDirty,
  isCategoryStoreDirty,
  isMutating,
  setDisabled,
  disabled,
  onSubmit,
  onDeleteEmployee,
  employeeName,
}: {
  isBasicInfoDirty?: boolean;
  isCategoryStoreDirty?: boolean;
  isMutating: boolean;
  setDisabled: (arg: boolean) => void;
  disabled: boolean;
  onSubmit: () => void;
  onDeleteEmployee: () => void;
  employeeName: string;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  return (
    <Menubar
      value={value}
      onValueChange={setValue}
      className="h-auto bg-transparent border-none"
    >
      <MenubarMenu value="details-mobile-menubar">
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {isBasicInfoDirty || isCategoryStoreDirty ? (
            <Modal
              onModalClose={() => {
                console.log("?");
                setValue("");
              }}
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
                        className={cn("flex w-full gap-1")}
                        disabled={isMutating}
                      >
                        <img src={redXIcon} />
                        取消編輯
                      </button>
                    </MenubarItem>
                    <MenubarSeparator />
                  </>
                );
              }}
              onSubmit={onSubmit}
            >
              資料尚未儲存，是否返回？
            </Modal>
          ) : disabled ? (
            <>
              <MenubarItem>
                <button
                  disabled={isMutating}
                  className="flex w-full gap-1"
                  onClick={() =>
                    navigate("/system-management/personnel-management")
                  }
                >
                  <img src={backIcon} />
                  返回
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          ) : (
            <>
              <MenubarItem>
                <button
                  onClick={() => setDisabled(true)}
                  className="flex w-full grid-1"
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
                onModalClose={() => setValue("")}
                dialogTriggerChildren={({ setOpen }) => {
                  return (
                    <MenubarItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      <button className="flex w-full gap-1">
                        <img src={redXIcon} />
                        刪除
                      </button>
                    </MenubarItem>
                  );
                }}
                onSubmit={onDeleteEmployee}
              >
                確認刪除{employeeName}?
              </Modal>
              <MenubarSeparator />
              <MenubarItem>
                <button
                  type="button"
                  onClick={(e) => {
                    // necessary to prevent the save button from firing
                    e.nativeEvent.stopImmediatePropagation();
                    setTimeout(() => {
                      setDisabled(false);
                    }, 0);
                  }}
                  className="flex w-full gap-1"
                >
                  <img src={pencilIcon} />
                  編輯
                </button>
              </MenubarItem>
              <MenubarSeparator />
            </>
          ) : (
            <>
              <MenubarItem>
                <button
                  disabled={
                    isMutating || !(isBasicInfoDirty || isCategoryStoreDirty)
                  }
                  form="new-employee-form"
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
