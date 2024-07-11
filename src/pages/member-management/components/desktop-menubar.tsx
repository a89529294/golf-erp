import backIcon from "@/assets/back.svg";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { linksKV } from "@/utils/links";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Member } from "@/pages/member-management/loader";
import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function DesktopMenubar<T extends FieldValues>({
  disabled,
  setDisabled,
  isUpdatingMemberStatus,
  data,
  toggleMemberStatus,
  isPending,
  form,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingMemberStatus: boolean;
  data: Member;
  toggleMemberStatus(): void;
  isPending: boolean;
  form: UseFormReturn<T>;
}) {
  return (
    <>
      {disabled === true ? (
        <>
          <Link
            className={cn(
              button(),
              isUpdatingMemberStatus && "pointer-events-none opacity-50",
            )}
            to={linksKV["member-management"].paths["index"]}
          >
            <img src={backIcon} />
            返回
          </Link>
          {data.isActive ? (
            <IconWarningButton
              disabled={isUpdatingMemberStatus}
              onClick={() => toggleMemberStatus()}
              icon="redX"
            >
              停權
            </IconWarningButton>
          ) : (
            <IconButton
              className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
              icon="check"
              onClick={() => toggleMemberStatus()}
              disabled={isUpdatingMemberStatus}
            >
              恢復
            </IconButton>
          )}
          <IconButton
            icon="pencil"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setDisabled(false);
            }}
            disabled={isUpdatingMemberStatus}
          >
            編輯
          </IconButton>
        </>
      ) : (
        <>
          <IconWarningButton
            type="button"
            onClick={() => {
              setDisabled(true);
              form.reset();
            }}
            icon="redX"
            disabled={isPending}
          >
            取消編輯
          </IconWarningButton>
          <IconButton
            disabled={
              Object.keys(form.formState.dirtyFields).length === 0 || isPending
            }
            icon="save"
            type="submit"
            form="member-form"
          >
            儲存
          </IconButton>
        </>
      )}
    </>
  );
}
