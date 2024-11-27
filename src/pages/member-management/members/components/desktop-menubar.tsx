import backIcon from "@/assets/back.svg";
// import { IconButton, IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Member } from "@/pages/member-management/members/loader";
import { memberFormSchema } from "@/pages/member-management/members/schemas";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SendCouponModal } from "@/pages/member-management/members/components/send-coupon-modal/send-coupon-modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";

export function DesktopMenubar({
  disabled,
  setDisabled,
  isUpdatingMemberStatus,
  data,
  toggleMemberStatus,
  isPending,
  form,
  allowEdit,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingMemberStatus: boolean;
  data: Member;
  toggleMemberStatus(): void;
  isPending: boolean;
  form: UseFormReturn<z.infer<typeof memberFormSchema>>;
  allowEdit?: boolean;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  return (
    <>
      {disabled === true ? (
        <>
          <Link
            className={cn(
              button(),
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
          {data.isActive && allowEdit && (
            <IconWarningButton
              disabled={isUpdatingMemberStatus}
              onClick={() => toggleMemberStatus()}
              icon="redX"
            >
              停權
            </IconWarningButton>
          )}
          {!data.isActive && allowEdit && (
            <IconButton
              className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
              icon="check"
              onClick={() => toggleMemberStatus()}
              disabled={isUpdatingMemberStatus}
            >
              恢復
            </IconButton>
          )}
          {allowEdit && (
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
          )}
          {storeId && <SendCouponModal show storeId={storeId} />}
        </>
      ) : (
        allowEdit && (
          <>
            <IconWarningButton
              type="button"
              onClick={() => {
                setDisabled(true);
                form.reset({
                  account: data.account,
                  memberType: data.appUserType,
                  chName: data.chName,
                  phone: data.phone ?? "",
                  gender: data.gender,
                  birthday: data.birthday ? new Date(data.birthday) : "",
                  isActive: data.isActive,
                });
              }}
              icon="redX"
              disabled={isPending}
            >
              取消編輯
            </IconWarningButton>
            <IconButton
              disabled={
                Object.keys(form.formState.dirtyFields).length === 0 ||
                isPending
              }
              icon="save"
              type="submit"
              form="member-form"
            >
              儲存
            </IconButton>
          </>
        )
      )}
    </>
  );
}
