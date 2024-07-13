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
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenubarSeparator } from "@radix-ui/react-menubar";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function DetailsSimulatorMobileMenubar<T extends FieldValues>({
  formDisabled,
  setFormDisabled,
  isPending,
  form,
  onReset,
  deleteModalTitle,
  deleteSite,
  onSubmit,
}: {
  formDisabled: boolean;
  setFormDisabled: (arg: boolean) => void;
  isPending: boolean;
  form: UseFormReturn<T>;
  onReset: () => void;
  deleteModalTitle: string;
  deleteSite: () => void;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu value="category-mobile-menu">
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {formDisabled ? (
            <MenubarItem>
              <button
                className="flex w-full gap-1"
                onClick={() => navigate(-1)}
              >
                <img src={backIcon} />
                返回
              </button>
            </MenubarItem>
          ) : Object.keys(form.formState.dirtyFields).length !== 0 ? (
            <Modal
              dialogTriggerChildren={
                <MenubarItem>
                  <button disabled={isPending} className="flex w-full gap-1">
                    <img src={redXIcon} />
                    取消編輯
                  </button>
                </MenubarItem>
              }
              onSubmit={onReset}
            >
              資料尚未儲存，是否返回？
            </Modal>
          ) : (
            <MenubarItem>
              <button
                className="flex w-full gap-1"
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
                dialogTriggerChildren={({ setOpen }) => {
                  return (
                    <MenubarItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      <button
                        disabled={isPending}
                        className="flex w-full gap-1"
                      >
                        <img src={trashCanIcon} />
                        刪除
                      </button>
                    </MenubarItem>
                  );
                }}
                title={deleteModalTitle}
                onSubmit={deleteSite}
              />
              <MenubarSeparator />
              <MenubarItem>
                <button
                  className="flex w-full gap-1"
                  type="button"
                  onClick={() => setTimeout(() => setFormDisabled(false), 0)}
                >
                  <img src={pencilIcon} />
                  編輯
                </button>
              </MenubarItem>
            </>
          ) : (
            <MenubarItem>
              <button
                disabled={isPending || !form.formState.isDirty}
                type="submit"
                className="flex w-full gap-1"
                onClick={onSubmit}
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
