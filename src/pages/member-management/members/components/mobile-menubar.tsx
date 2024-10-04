import backIcon from "@/assets/back.svg";
// import checkIcon from "@/assets/check.svg";
// import pencilIcon from "@/assets/pencil.svg";
// import redXIcon from "@/assets/red-x-icon.svg";
// import saveIcon from "@/assets/save.svg";
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
import { Member } from "@/pages/member-management/members/loader";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export function MobileMenubar<T extends FieldValues>({
  disabled,
  setDisabled,
  isUpdatingMemberStatus,
  data,
  toggleMemberStatus,
  isPending,
  form,
  onSubmit,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingMemberStatus: boolean;
  data: Member;
  toggleMemberStatus(): void;
  isPending: boolean;
  form: UseFormReturn<T>;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Menubar className="h-auto border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className={button()}>選項</MenubarTrigger>
        <MenubarContent>
          {disabled === true ? (
            <>
              <MenubarItem>
                <Link
                  className={cn(
                    "flex gap-1",
                    isUpdatingMemberStatus && "pointer-events-none opacity-50",
                  )}
                  to={".."}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                >
                  <img src={backIcon} />
                  返回
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              {/* {data.isActive ? (
                <>
                  <MenubarItem>
                    <button
                      disabled={isUpdatingMemberStatus}
                      onClick={() => toggleMemberStatus()}
                      className="flex gap-1"
                    >
                      <img src={redXIcon} />
                      停權
                    </button>
                  </MenubarItem>
                  <MenubarSeparator />
                </>
              ) : (
                <>
                  <MenubarItem>
                    <button
                      className="flex gap-1 "
                      onClick={() => toggleMemberStatus()}
                      disabled={isUpdatingMemberStatus}
                    >
                      <img src={checkIcon} />
                      恢復
                    </button>
                  </MenubarItem>
                  <MenubarSeparator />
                </>
              )} */}
              {/* <MenubarItem>
                <button
                  type="button"
                  onClick={() => {
                    // e.preventDefault();
                    setDisabled(false);
                  }}
                  disabled={isUpdatingMemberStatus}
                  className="flex gap-1"
                >
                  <img src={pencilIcon} />
                  編輯
                </button>
              </MenubarItem> */}
              <MenubarSeparator />
            </>
          ) : (
            <>
              {/* <MenubarItem>
                <button
                  type="button"
                  onClick={() => {
                    setDisabled(true);
                    form.reset();
                  }}
                  disabled={isPending}
                  className="flex gap-1"
                >
                  <img src={redXIcon} />
                  取消編輯
                </button>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                asChild
                onSelect={() => {
                  // prevent menu from closing, need menu open for submit to work
                  //   e.preventDefault();
                  onSubmit();
                }}
              >
                <button
                  disabled={
                    Object.keys(form.formState.dirtyFields).length === 0 ||
                    isPending
                  }
                  type="submit"
                  form="member-form"
                  className="flex gap-1"
                >
                  <img src={saveIcon} />
                  儲存
                </button>
              </MenubarItem> */}
            </>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
